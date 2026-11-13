/**
 * Three.js host: one renderer, one scene, one camera rig for every view (docs/08).
 * Level changes use a flatten → dive/extrude transition while the camera interpolates between view poses.
 * Rendering never writes simulation state.
 */
import * as THREE from 'three';
import { CameraRig, ease, presetPose } from './rig';
import { havocVisuals, renderStyles, templateViews } from './registry';
import type { StyleKit, ViewInstance } from './types';
import type { LevelSim } from '@/sim/level';
import type { PaletteManifest, View } from '@/content/types';
import type { AvatarRig } from '@/avatar/procedural';
import { QualityScaler } from './quality';

export interface LevelLook {
  templateId: string;
  view: View;
  styleId: string;
  palette: PaletteManifest;
  havocIds: string[];
  havocMaxP: number;
}

interface Mounted {
  look: LevelLook;
  root: THREE.Group;
  inst: ViewInstance;
  kit: StyleKit;
  avatar: AvatarRig;
}

export const TRANSITION_MS = 2400;
const SWAP_AT = 0.42;

export class RenderHost {
  readonly renderer: THREE.WebGLRenderer;
  /** false when the browser cannot create a WebGL context: the game still runs, with the HUD only. */
  readonly webgl: boolean;
  readonly scene = new THREE.Scene();
  readonly world = new THREE.Group();
  readonly rig = new CameraRig();
  readonly quality: QualityScaler;
  reducedMotion = false;
  private current: Mounted | null = null;
  private outgoing: Mounted | null = null;
  private pending: { look: LevelLook; avatar: AvatarRig } | null = null;
  private tStart = -1;
  private bgFrom = new THREE.Color('#000');
  private bgTo = new THREE.Color('#000');
  private lastNow = 0;

  constructor(readonly canvas: HTMLCanvasElement) {
    let renderer: THREE.WebGLRenderer;
    let webgl = true;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true, logarithmicDepthBuffer: true });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    } catch (e) {
      // No WebGL (disabled, blocklisted GPU, headless browser): keep the game playable without 3D graphics.
      console.warn('WebGL unavailable, running without 3D graphics:', e);
      webgl = false;
      renderer = nullRenderer(canvas);
    }
    this.renderer = renderer;
    this.webgl = webgl;
    this.quality = new QualityScaler(this.renderer);
    this.scene.add(this.world);
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(4, 10, 6);
    this.scene.add(sun);
    this.scene.background = new THREE.Color('#000');
    this.resize();
    addEventListener('resize', () => this.resize());
  }

  resize(): void {
    const w = this.canvas.clientWidth || innerWidth;
    const h = this.canvas.clientHeight || innerHeight;
    this.renderer.setSize(w, h, false);
    this.current?.kit.setSize?.(w, h, this.renderer.getPixelRatio());
  }

  get transitioning(): boolean {
    return this.tStart >= 0;
  }

  private mount(look: LevelLook, avatar: AvatarRig, sim: LevelSim): Mounted {
    const tv = templateViews[look.templateId];
    if (!tv) throw new Error(`No view for ${look.templateId}`);
    const style = renderStyles[look.styleId] ?? renderStyles['style.flat'];
    const kit = style.build(look.palette, { lite: this.quality.lite });
    const root = new THREE.Group();
    const inst = tv.create({ root, style: kit, palette: look.palette, avatar, view: look.view });
    inst.update(sim, 0, this.lastNow);
    this.world.add(root);
    const w = this.canvas.clientWidth || innerWidth;
    const h = this.canvas.clientHeight || innerHeight;
    kit.setSize?.(w, h, this.renderer.getPixelRatio());
    return { look, root, inst, kit, avatar };
  }

  private unmount(m: Mounted): void {
    for (const id of m.look.havocIds) havocVisuals[id]?.reset({ world: this.world, rig: this.rig });
    this.world.remove(m.root);
    m.inst.dispose();
    m.kit.dispose();
    m.root.traverse((o) => {
      if (o instanceof THREE.Mesh) o.geometry.dispose();
    });
  }

  /** Show a level. With transition=true the old level flattens, the camera moves, and the new one extrudes. */
  setLevel(look: LevelLook, avatar: AvatarRig, sim: LevelSim, now: number, transition: boolean): void {
    if (!transition || !this.current) {
      if (this.current) this.unmount(this.current);
      if (this.outgoing) this.unmount(this.outgoing);
      this.outgoing = null;
      this.pending = null;
      this.tStart = -1;
      this.current = this.mount(look, avatar, sim);
      this.rig.setPose(this.current.inst.pose(sim));
      this.scene.background = this.current.kit.background.clone();
      return;
    }
    this.outgoing = this.current;
    this.current = null;
    this.pending = { look, avatar };
    this.tStart = now;
    this.bgFrom = (this.scene.background as THREE.Color).clone();
    // Build the new level now (hidden) so its camera pose is known for the dolly zoom.
    const next = this.mount(look, avatar, sim);
    next.root.visible = false;
    this.current = next;
    this.bgTo = next.kit.background.clone();
    const pose = next.inst.pose(sim);
    this.rig.transition(pose, TRANSITION_MS, now);
  }

  render(sim: LevelSim | null, alpha: number, now: number): void {
    this.lastNow = now;
    this.quality.tick(now);
    const cur = this.current;
    if (this.tStart >= 0) {
      const k = Math.min(1, (now - this.tStart) / TRANSITION_MS);
      (this.scene.background as THREE.Color).copy(this.bgFrom).lerp(this.bgTo, ease(k));
      if (this.outgoing) {
        // Flatten the outgoing world into a sheet.
        const f = Math.min(1, k / SWAP_AT);
        this.outgoing.root.scale.set(1, 1 - 0.6 * ease(f), Math.max(0.02, 1 - ease(f)));
        if (k >= SWAP_AT) {
          this.unmount(this.outgoing);
          this.outgoing = null;
        }
      }
      if (cur && k >= SWAP_AT) {
        // Extrude the new world out of the sheet.
        const g = (k - SWAP_AT) / (1 - SWAP_AT);
        cur.root.visible = true;
        cur.root.scale.set(1, 0.4 + 0.6 * ease(g), Math.max(0.02, ease(g)));
      }
      if (k >= 1) {
        this.tStart = -1;
        this.pending = null;
        if (cur) cur.root.scale.set(1, 1, 1);
      }
    }
    if (cur && sim) {
      if (cur.root.visible) cur.inst.update(sim, alpha, now);
      if (!this.rig.transitioning) {
        const p = cur.inst.pose(sim);
        this.rig.pose.fov = p.fov;
        this.rig.pose.frameHeight += (p.frameHeight - this.rig.pose.frameHeight) * 0.05;
        this.rig.pose.yaw = p.yaw;
        this.rig.pose.pitch = p.pitch;
        this.rig.follow(p.target, 0.12);
      } else this.rig.follow(cur.inst.pose(sim).target);
      const stageFrac = sim.setup.stageLengths.length > 1 ? Math.min(sim.state.stage, sim.setup.stageLengths.length - 1) / (sim.setup.stageLengths.length - 1) : 1;
      const intensityP = Math.round(cur.look.havocMaxP * stageFrac);
      for (const id of cur.look.havocIds) havocVisuals[id]?.apply({ world: this.world, rig: this.rig, intensityP, time: now, reducedMotion: this.reducedMotion });
    }
    const w = this.canvas.clientWidth || innerWidth;
    const h = this.canvas.clientHeight || innerHeight;
    this.rig.update(now, w / Math.max(1, h));
    const kit = cur ?? this.outgoing;
    if (!this.webgl) return;
    if (!kit?.kit.render?.(this.renderer, this.scene, this.rig.camera)) this.renderer.render(this.scene, this.rig.camera);
  }

  /** Static pose helper for previews. */
  static pose(view: View) {
    return presetPose(view);
  }
}

/** Stand-in used when WebGL is unavailable: accepts the calls the host makes and draws nothing. */
function nullRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
  let pr = 1;
  return {
    domElement: canvas,
    outputColorSpace: THREE.SRGBColorSpace,
    setSize: () => {},
    setPixelRatio: (v: number) => void (pr = v),
    getPixelRatio: () => pr,
    render: () => {},
    dispose: () => {},
  } as unknown as THREE.WebGLRenderer;
}


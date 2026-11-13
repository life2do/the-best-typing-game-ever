import type * as THREE from 'three';
import type { LevelSim } from '@/sim/level';
import type { PaletteManifest, View } from '@/content/types';
import type { CameraPose, CameraRig } from './rig';
import type { AvatarRig } from '@/avatar/procedural';

export type MaterialRole = 'ground' | 'avatar' | 'accent' | 'hazard' | 'prop' | 'glow' | 'sky' | 'ice';

export interface StyleKit {
  id: string;
  background: THREE.Color;
  material(role: MaterialRole, color?: THREE.ColorRepresentation): THREE.Material;
  /** Optional post-processing; returns false if it did not render (caller renders normally). */
  render?(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera): boolean;
  setSize?(w: number, h: number, pixelRatio: number): void;
  dispose(): void;
}

export interface RenderStyle {
  id: string;
  build(palette: PaletteManifest, opts: { lite: boolean }): StyleKit;
}

export interface HavocVisual {
  id: string;
  /** Called every frame; must only change the world/camera, never input. */
  apply(ctx: { world: THREE.Group; rig: CameraRig; intensityP: number; time: number; reducedMotion: boolean }): void;
  reset(ctx: { world: THREE.Group; rig: CameraRig }): void;
}

export interface ViewApi {
  root: THREE.Group;
  style: StyleKit;
  palette: PaletteManifest;
  avatar: AvatarRig;
  view: View;
}

export interface ViewInstance {
  /** Desired camera pose for the current state. */
  pose(sim: LevelSim): CameraPose;
  /** Update scene from simulation state. alpha = fraction of the current frame (0..1). */
  update(sim: LevelSim, alpha: number, timeMs: number): void;
  dispose(): void;
}

export interface TemplateView {
  id: string;
  /** Icon + short text rules shown in the intro overlay and read by TTS. */
  rules: { icon: string; text: string }[];
  create(api: ViewApi): ViewInstance;
}

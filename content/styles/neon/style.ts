/** Neon style: emissive materials plus bloom. Lite variant skips the bloom pass. */
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import type { RenderStyle, StyleKit, MaterialRole } from '@/render/types';

const style: RenderStyle = {
  id: 'style.neon',
  build(palette, { lite }): StyleKit {
    const c = palette.colors;
    const roles: Record<MaterialRole, string> = {
      ground: c.ground ?? c.fg, avatar: c.accent, accent: c.accent, hazard: c.negative, prop: c.positive, glow: c.accent, sky: c.sky ?? c.bg, ice: '#9ff3ff',
    };
    const made: THREE.Material[] = [];
    let composer: EffectComposer | null = null;
    let bound: { scene: THREE.Scene; camera: THREE.Camera } | null = null;
    let size = { w: 1, h: 1, pr: 1 };
    return {
      id: 'style.neon',
      background: new THREE.Color(c.bg).multiplyScalar(0.6),
      material(role, color) {
        const col = new THREE.Color(color ?? roles[role]);
        const emissive = role === 'ground' ? 0.2 : role === 'sky' ? 0.08 : role === 'prop' ? 0.35 : 0.8;
        const m = new THREE.MeshStandardMaterial({
          color: col.clone().multiplyScalar(0.4), emissive: col, emissiveIntensity: emissive, roughness: 0.4, metalness: 0.2,
          transparent: role === 'ice' || role === 'glow', opacity: role === 'ice' ? 0.55 : role === 'glow' ? 0.6 : 1,
        });
        made.push(m);
        return m;
      },
      render(renderer, scene, camera) {
        if (lite) return false;
        if (!composer || !bound || bound.scene !== scene || bound.camera !== camera) {
          composer?.dispose();
          composer = new EffectComposer(renderer);
          composer.addPass(new RenderPass(scene, camera));
          composer.addPass(new UnrealBloomPass(new THREE.Vector2(size.w, size.h), 0.55, 0.4, 0.55));
          composer.addPass(new OutputPass());
          composer.setPixelRatio(size.pr);
          composer.setSize(size.w, size.h);
          bound = { scene, camera };
        }
        composer.render();
        return true;
      },
      setSize(w, h, pr) {
        size = { w, h, pr };
        composer?.setPixelRatio(pr);
        composer?.setSize(w, h);
      },
      dispose() {
        for (const m of made) m.dispose();
        composer?.dispose();
      },
    };
  },
};
export default style;

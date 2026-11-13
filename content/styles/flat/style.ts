/** Flat style: unlit-looking shapes from the palette. Cheapest; the lite fallback for other styles. */
import * as THREE from 'three';
import type { RenderStyle, StyleKit, MaterialRole } from '@/render/types';

const style: RenderStyle = {
  id: 'style.flat',
  build(palette): StyleKit {
    const c = palette.colors;
    const roles: Record<MaterialRole, string> = {
      ground: c.ground ?? c.fg, avatar: c.accent, accent: c.accent, hazard: c.negative, prop: c.positive, glow: c.accent, sky: c.sky ?? c.bg, ice: '#cfefff',
    };
    const made: THREE.Material[] = [];
    return {
      id: 'style.flat',
      background: new THREE.Color(c.bg),
      material(role, color) {
        const m = new THREE.MeshLambertMaterial({ color: new THREE.Color(color ?? roles[role]), transparent: role === 'ice' || role === 'glow', opacity: role === 'ice' ? 0.6 : role === 'glow' ? 0.5 : 1 });
        if (role === 'glow') (m as THREE.MeshLambertMaterial).emissive = new THREE.Color(color ?? roles[role]);
        made.push(m);
        return m;
      },
      dispose() {
        for (const m of made) m.dispose();
      },
    };
  },
};
export default style;

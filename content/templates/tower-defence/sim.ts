/**
 * Isometric tower defence — deterministic part (targeting input).
 * Friendly "blob" creatures carry letters and wander along a path toward the crystal tower.
 * Typing a creature's letters freezes it into an ice cube (non-violent). Creatures only move
 * while the world moves (ctx.v), so stopping typing stops the world (docs/02).
 */
import type { TemplateSim, TemplateCtx, Target } from '@/sim/types';
import { floorDiv } from '@/core/fixed';

export interface Creature {
  id: number; // target id
  pos: number; // Q16 distance along the path, 0 = spawn, PATH_LEN = tower
  lane: number; // 0..2
  frozen: number; // frame frozen, -1 = active
}
export interface TowerState {
  creatures: Creature[];
  bonks: number; // creatures that reached the tower (they bounce back; cosmetic only)
  lastBonk: number;
  frozenCount: number;
  stumble: number;
}

export const PATH_LEN = 12 * 65536;

function activeCount(s: TowerState): number {
  let n = 0;
  for (const c of s.creatures) if (c.frozen < 0) n++;
  return n;
}

function fill(s: TowerState, ctx: TemplateCtx): void {
  const want = 2 + Math.min(ctx.state.stage, 2);
  while (activeCount(s) < want) {
    const t = ctx.spawnTarget();
    if (!t) return;
    s.creatures.push({ id: t.id, pos: ctx.rng.int(2 * 65536), lane: ctx.rng.int(3), frozen: -1 });
  }
}

const sim: TemplateSim<TowerState> = {
  id: 'template.tower-defence',
  vBase: 2400,
  init: () => ({ creatures: [], bonks: 0, lastBonk: -1, frozenCount: 0, stumble: -1 }),
  onStageStart(s, ctx) {
    s.creatures = s.creatures.filter((c) => c.frozen >= 0).slice(-6);
    fill(s, ctx);
  },
  onTick(s, ctx) {
    fill(s, ctx);
  },
  onTargetComplete(s, ctx, t: Target) {
    const c = s.creatures.find((x) => x.id === t.id);
    if (c) {
      c.frozen = ctx.frame;
      s.frozenCount++;
    }
    s.creatures = s.creatures.filter((x) => x.frozen < 0 || ctx.frame - x.frozen < 600).slice(-14);
    fill(s, ctx);
  },
  onError(s, ctx) {
    s.stumble = ctx.frame;
  },
  step(s, ctx) {
    if (ctx.v === 0) return;
    const d = floorDiv(floorDiv(ctx.v, 3) * ctx.hazardP, 1000);
    for (const c of s.creatures) {
      if (c.frozen >= 0) continue;
      c.pos += d;
      if (c.pos >= PATH_LEN) {
        c.pos = PATH_LEN - 4 * 65536; // bounce back from the tower's shield
        s.bonks++;
        s.lastBonk = ctx.frame;
      }
    }
  },
  isAtRest: () => true,
};
export default sim;

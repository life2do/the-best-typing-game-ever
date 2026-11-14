/**
 * Bot typist (docs/10 §5): a pure, seeded, integer-only generator of input logs.
 * It runs alongside a headless LevelSim only to ask "what is expected next?" — its output is a
 * plain log that goes through exactly the same path as a recorded human run.
 */
import { Rng } from '../../src/core/rng';
import { clamp, floorDiv } from '../../src/core/fixed';
import { LevelSim, type LevelSimOptions } from '../../src/sim/level';
import type { LevelSetup, LogEvent, TemplateSim } from '../../src/sim/types';
import { tierAcc } from '../../src/typing/tiers';

export type BotProfile = 'pass' | 'star3' | 'struggle' | 'idle' | 'robot' | 'masher';
export const BOT_PROFILES: BotProfile[] = ['pass', 'star3', 'struggle', 'idle', 'robot', 'masher'];

interface ProfileParams {
  speedP: number; // permille of target speed; or fixed WPM via fixedWpm
  fixedWpm?: number;
  errP: number;
  cvP: number;
  pauseP: number;
  idleEvery?: number;
  mash?: boolean;
}

export function profileParams(profile: BotProfile, tier: number): ProfileParams {
  const acc = tierAcc(tier);
  const passCv = 450 - (clamp(tier, 1, 7) - 1) * 50;
  switch (profile) {
    case 'pass': return { speedP: 1400, errP: floorDiv(1000 - acc, 2), cvP: passCv, pauseP: 5 };
    case 'star3': return { speedP: 1700, errP: floorDiv(1000 - acc, 4), cvP: 120, pauseP: 0 };
    case 'struggle': return { speedP: 600, errP: 1000 - acc + 60, cvP: 600, pauseP: 20 };
    case 'idle': return { speedP: 1400, errP: floorDiv(1000 - acc, 2), cvP: passCv, pauseP: 0, idleEvery: 40 };
    case 'robot': return { speedP: 0, fixedWpm: 120, errP: 0, cvP: 0, pauseP: 0 };
    case 'masher': return { speedP: 0, fixedWpm: 300, errP: 0, cvP: 300, pauseP: 0, mash: true };
  }
}

export interface BotRunOptions extends LevelSimOptions {
  profile: BotProfile;
  botSeed: string;
  /** simulated time budget (ms); default per docs/10 §5.5 */
  budgetMs?: number;
}

export interface BotRun {
  log: LogEvent[];
  sim: LevelSim;
  completed: boolean;
  simulatedMs: number;
  stuckAtMs: number; // -1 if never
  idleHintSeen: boolean;
  minVisibility: number;
}

export function budgetFor(tier: number): number {
  return (tier <= 3 ? 20 : 12) * 60_000;
}

export function runBot(setup: LevelSetup, template: TemplateSim, o: BotRunOptions): BotRun {
  const sim = new LevelSim(setup, template, o);
  const rng = Rng.fromSeed(`${o.botSeed}:bot:${o.profile}:${setup.tier}:${setup.levelIndex}`);
  const pp = profileParams(o.profile, setup.tier);
  const budget = o.budgetMs ?? budgetFor(setup.tier);
  const wpmP = pp.fixedWpm ? pp.fixedWpm * 1000 : floorDiv(sim.targetWpmP * pp.speedP, 1000);
  const mu = Math.max(20, floorDiv(12_000_000, Math.max(1, wpmP)));
  const layout = setup.language.layout;
  const codes = Object.keys(layout).filter((c) => layout[c].row !== 'number' || /^Digit/.test(c)).sort();
  const log: LogEvent[] = [];
  const seenNew: Record<string, number> = {};
  let t = 0;
  let keys = 0;
  let stuckAtMs = -1;
  let idleHintSeen = false;
  let minVisibility = 1000;

  const press = (code: string, shift = false) => {
    const e: LogEvent = shift ? { k: 'key', t, code, shift: 1 } : { k: 'key', t, code };
    log.push(e);
    sim.feed(e);
    keys++;
  };
  const observe = () => {
    if (sim.state.phase === 'play') {
      const v = sim.visibility();
      if (v < minVisibility) minVisibility = v;
      if (stuckAtMs < 0 && sim.stuck()) stuckAtMs = t;
    }
  };

  const jitter = () => {
    const s = rng.int(65536) + rng.int(65536) + rng.int(65536) + rng.int(65536) - 131070;
    const iv = mu + floorDiv(mu * pp.cvP * s, 1000 * 37837);
    return clamp(iv, floorDiv(mu, 4), mu * 4);
  };

  const wrongCode = (expected: string[]): string => {
    const exp = setup.language.codeOf[expected[0]];
    const info = exp ? layout[exp] : undefined;
    const ok = (c: string) => !!layout[c] && !expected.includes(layout[c].char);
    if (info) {
      const r = rng.int(100);
      let cands: string[];
      if (r < 60) cands = codes.filter((c) => layout[c].row === info.row && Math.abs(layout[c].col - info.col) === 1);
      else if (r < 85) cands = codes.filter((c) => layout[c].finger === info.finger && layout[c].row !== info.row);
      else {
        const mirror = (info.finger[0] === 'l' ? 'r' : 'l') + info.finger[1];
        cands = codes.filter((c) => layout[c].finger === mirror);
      }
      cands = cands.filter(ok);
      if (cands.length) return rng.pick(cands);
    }
    const any = codes.filter(ok);
    return rng.pick(any);
  };

  // Intro: hands on F and J, press both.
  t += 800;
  press('KeyF');
  t += 40;
  press('KeyJ');

  let afterError = false;
  while (sim.state.phase !== 'done' && t < budget) {
    observe();
    if (sim.state.phase === 'crossroads') {
      t += 900;
      press('KeyJ');
      continue;
    }
    const expected = sim.expectedChars();
    if (!expected.length) {
      // Nothing to type (should not happen); let time pass.
      t += 1000;
      sim.advanceTo(t);
      continue;
    }
    if (pp.mash) {
      t += jitter();
      press(rng.pick(codes));
      continue;
    }
    const ch = expected[0];
    const code = setup.language.codeOf[ch];
    let iv = afterError ? floorDiv(mu * 13, 10) : jitter();
    if (!afterError && !pp.fixedWpm) {
      if (setup.newKeys.includes(ch) && ch !== ' ' && (seenNew[ch] = (seenNew[ch] ?? 0) + 1) <= 20) iv = floorDiv(iv * 3, 2);
      const row = code ? layout[code].row : 'home';
      if (row !== 'home' && row !== 'space') iv = floorDiv(iv * 11, 10);
      if (pp.pauseP && rng.chance(pp.pauseP)) iv += 1000 + rng.int(2000);
      if (pp.idleEvery && keys > 0 && keys % pp.idleEvery === 0) {
        t += 10_000;
        sim.advanceTo(t);
        if (sim.idleHint()) idleHintSeen = true;
      }
    }
    t += iv;
    const errP = afterError ? floorDiv(pp.errP, 2) : pp.errP;
    if (pp.errP && rng.chance(errP)) {
      press(wrongCode(expected));
      afterError = true;
      continue;
    }
    afterError = false;
    press(code, !!setup.language.needsShift[ch]); // capitals, ?, !, ( … need Shift held
  }
  observe();
  log.push({ k: 'end', t });
  sim.feed({ k: 'end', t });
  return { log, sim, completed: sim.state.phase === 'done', simulatedMs: t, stuckAtMs, idleHintSeen, minVisibility };
}

/** Replay a log on a fresh simulation (the verifier path). */
export function replayLog(setup: LevelSetup, template: TemplateSim, log: readonly LogEvent[], o: LevelSimOptions = {}): LevelSim {
  const sim = new LevelSim(setup, template, o);
  for (const e of log) sim.feed(e);
  return sim;
}

/**
 * Verify & Re-play page (docs/05). Verify: re-simulates every segment headlessly and checks snapshot
 * hashes, stars, completion and timing plausibility. Re-play: renders the run with speed controls and a
 * seek bar with letter marks.
 */
import '@/ui/style.css';
import { h } from '@/ui/dom';
import { allSegments, type Segment } from '@/storage/profile';
import { campaignOf, simAt, verifySegment, type RunFile, type SegmentVerdict } from './replay';
import { RenderHost } from '@/render/host';
import { palettes, scales } from '@/content/registry';
import { AvatarRig } from '@/avatar/procedural';
import { Hud } from '@/ui/hud';
import { language } from '@/campaign/setup';
import { DEFAULT_SETTINGS } from '@/storage/profile';
import { BUILD } from './build-info';
import type { LevelSim } from '@/sim/level';
import type { Campaign } from '@/campaign/campaign';

const ui = document.getElementById('ui')!;
const canvas = document.getElementById('world') as HTMLCanvasElement;
const host = new RenderHost(canvas);
(window as any).__verify = { ui };

async function localRuns(): Promise<RunFile[]> {
  const segs = await allSegments().catch(() => [] as Segment[]);
  const by: Record<string, Segment[]> = {};
  for (const s of segs) (by[s.campaignSeed] ??= []).push(s);
  return Object.entries(by).map(([seed, list]) => ({ format: 'tbtge-run/1', build: list[0].build, campaign: { language: list[0].language, seed }, segments: list.sort((a, b) => a.level - b.level) }));
}

function chooser(runs: RunFile[]): void {
  const file = h('input', { type: 'file', accept: '.json,application/json' });
  file.addEventListener('change', async () => {
    const f = file.files?.[0];
    if (!f) return;
    try {
      open(JSON.parse(await f.text()) as RunFile);
    } catch (e) {
      alert(`Could not read this file: ${(e as Error).message}`);
    }
  });
  ui.replaceChildren(
    h('div', { class: 'overlay' }, h('div', { class: 'card' },
      h('h1', {}, 'Verify & Re-play'),
      h('p', {}, 'Pick a run saved on this device, or open a run file someone shared with you.'),
      h('div', { class: 'runs' }, ...(runs.length ? runs.map((r) => h('button', { class: 'secondary', onclick: () => open(r) }, `Run ${r.campaign.seed.slice(0, 8)} — ${r.segments.length} level(s), up to level ${Math.max(...r.segments.map((s) => s.level))}`)) : [h('p', {}, 'No runs on this device yet.')])),
      h('p', {}, 'Open a run file: ', file),
      h('p', {}, h('a', { href: '../', style: { color: 'white' } }, '← Back to the game')),
    )),
  );
}

function verdictView(v: SegmentVerdict[]): HTMLElement {
  const allOk = v.every((x) => x.ok);
  const sus = v.some((x) => x.timing.suspicious);
  const buildWarn = v.some((x) => !x.buildMatches);
  return h('div', {},
    h('div', { class: `verdict ${allOk ? 'ok' : 'bad'}` }, allOk ? '✅ Verified: every level re-simulates to the same fingerprints, stars and results.' : '❌ Mismatch: this run does not re-simulate to the recorded fingerprints.'),
    sus ? h('div', { class: 'verdict warn' }, '⚠️ Suspicious timing: keystrokes look machine-generated. (A hint only — see docs.)') : null,
    buildWarn ? h('div', { class: 'verdict warn' }, `ℹ️ Some levels were recorded on another build. Checked with this build (${BUILD.slice(0, 16)}).`) : null,
    h('div', {}, ...v.map((x) => h('span', { style: { marginRight: '12px' } }, `${x.ok ? '✅' : '❌'} L${x.level} ${x.letters} ${'★'.repeat(x.stars)}`))),
  );
}

function open(run: RunFile): void {
  const camp = campaignOf(run);
  const segs = run.segments.slice().sort((a, b) => a.level - b.level);
  const verdicts = segs.map((s) => verifySegment(camp, s, BUILD));
  (window as any).__verify.verdicts = verdicts;
  const starts: number[] = [];
  let total = 0;
  for (const v of verdicts) {
    starts.push(total);
    total += v.durationMs + 1;
  }
  const player = new Player(camp, segs, starts, total);
  const fill = h('div', { class: 'fill' });
  const seek = h('div', { class: 'seek', title: 'Seek' }, fill,
    ...verdicts.map((v, i) => h('div', { class: 'mark', style: { left: `${(starts[i] / total) * 100}%` } }, h('span', {}, v.letters))),
    ...verdicts.flatMap((v, i) => v.stageTimes.map((t) => h('div', { class: 'tick', style: { left: `${((starts[i] + t) / total) * 100}%` } }))));
  seek.addEventListener('click', (e) => {
    const r = seek.getBoundingClientRect();
    player.seek(((e.clientX - r.left) / r.width) * total);
  });
  const play = h('button', { onclick: () => player.toggle() }, '⏯ Play / pause');
  const speed = h('select', { 'aria-label': 'Speed' }, ...[0.25, 0.5, 1, 2, 4, 8, 16].map((s) => h('option', { value: s, selected: s === 1 }, `${s}×`)));
  speed.addEventListener('change', () => (player.speed = Number(speed.value)));
  const time = h('span', {});
  ui.replaceChildren(h('div', { class: 'verify-bar' }, verdictView(verdicts), h('div', { class: 'controls' }, play, speed, time, h('button', { class: 'secondary', onclick: () => location.reload() }, 'Other run')), seek));
  player.onTick = (t) => {
    fill.style.width = `${(t / total) * 100}%`;
    time.textContent = `${fmt(t)} / ${fmt(total)}`;
  };
  player.start();
}

const fmt = (ms: number) => `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}`;

class Player {
  speed = 1;
  playing = true;
  onTick: (t: number) => void = () => {};
  private t = 0;
  private segIndex = -1;
  private sim: LevelSim | null = null;
  private next = 0;
  private hud: Hud | null = null;
  private last = 0;

  constructor(private camp: Campaign, private segs: Segment[], private starts: number[], private total: number) {}

  start(): void {
    this.seek(0);
    requestAnimationFrame((n) => this.frame(n));
  }

  toggle(): void {
    this.playing = !this.playing;
  }

  seek(t: number): void {
    this.t = Math.max(0, Math.min(this.total - 1, t));
    let i = this.starts.length - 1;
    while (i > 0 && this.starts[i] > this.t) i--;
    const changed = i !== this.segIndex;
    const { sim, next } = simAt(this.camp, this.segs[i], this.t - this.starts[i]);
    this.sim = sim;
    this.next = next;
    if (changed) this.mount(i, this.segIndex >= 0);
    this.segIndex = i;
  }

  private mount(i: number, transition: boolean): void {
    const plan = this.camp.levels[this.segs[i].level - 1];
    const palette = palettes.find((p) => p.id === plan.paletteId) ?? palettes[0];
    const avatar = new AvatarRig(scales[0], this.segs[i].tier);
    host.setLevel({ templateId: plan.templateId, view: plan.view, styleId: plan.styleId, palette, havocIds: plan.havocIds, havocMaxP: plan.havocMaxP }, avatar, this.sim!, performance.now(), transition);
    this.hud?.el.remove();
    this.hud = new Hud(language(this.camp.language), { ...DEFAULT_SETTINGS, keyboard: 'off' });
    this.hud.keyboard.setKnown(plan.letters, plan.newKeys);
    ui.prepend(this.hud.el);
  }

  private frame(now: number): void {
    requestAnimationFrame((n) => this.frame(n));
    const dt = this.last ? now - this.last : 16;
    this.last = now;
    if (this.playing && this.sim) {
      const nt = this.t + dt * this.speed;
      const seg = this.segs[this.segIndex];
      const local = nt - this.starts[this.segIndex];
      if (local > (seg.log.at(-1)?.t ?? 0) && this.segIndex < this.segs.length - 1) this.seek(this.starts[this.segIndex + 1]);
      else {
        this.t = Math.min(nt, this.total - 1);
        const loc = this.t - this.starts[this.segIndex];
        while (this.next < seg.log.length && seg.log[this.next].t <= loc) this.sim.feed(seg.log[this.next++]);
        if (this.sim.state.pauseAt < 0 && this.sim.state.phase !== 'done') this.sim.advanceTo(Math.max(loc, this.sim.state.simT + this.sim.state.pausedMs));
      }
    }
    host.render(this.sim, 0, now);
    if (this.sim && this.hud) this.hud.update(this.sim, canvas);
    this.onTick(this.t);
  }
}

void localRuns().then(chooser);

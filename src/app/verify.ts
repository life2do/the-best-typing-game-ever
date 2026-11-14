/**
 * Verify & Re-play page (docs/05). Verify: re-simulates every segment headlessly — each on the build that
 * recorded it when that build is published (it runs as an engine in a hidden frame) — and checks snapshot
 * hashes, stars, completion and timing plausibility; for a proof (`.proof` or the artifact PNG) also the
 * run fingerprint, the summary, the code ring and the hidden name. A screenshot showing only the ring gives
 * a fingerprint lookup (weak check). Re-play: renders the run with speed controls and a seek bar.
 *
 * `?engine=1`: engine mode for other builds' verify pages (no UI): verifies the segments it is sent.
 */
import '@/ui/style.css';
import { h } from '@/ui/dom';
import { allSegments, type Segment } from '@/storage/profile';
import { campaignOf, planOf, simAt, verifySegment, type RunFile, type SegmentVerdict } from './replay';
import { RenderHost } from '@/render/host';
import { palettes, scales } from '@/content/registry';
import { AvatarRig } from '@/avatar/procedural';
import { Hud } from '@/ui/hud';
import { language } from '@/campaign/setup';
import { DEFAULT_SETTINGS } from '@/storage/profile';
import { BUILD, versionBadge } from './build-info';
import { isPng, readITXt } from '@/proof/png';
import { readRing } from '@/proof/ring';
import { fingerprintBytes, runFingerprint, shortFingerprint } from '@/proof/fingerprint';
import { nameMatches, parseProof, proofToRun, summarize, PROOF_FORMAT, PROOF_KEYWORD, type ProofBundle } from '@/proof/bundle';
import type { LevelSim } from '@/sim/level';
import type { Campaign } from '@/campaign/campaign';

const ui = document.getElementById('ui')!;
const canvas = document.getElementById('world') as HTMLCanvasElement;
const ENGINE = new URLSearchParams(location.search).has('engine');
const host = ENGINE ? (null as unknown as RenderHost) : new RenderHost(canvas);
(window as any).__verify = { ui };

// ---------------------------------------------------------------- per-build engines
/** Where the verify engine of `build` is published (/v/<id>/verify/ next to this build's), or null (dev). */
function engineUrl(build: string): string | null {
  const override = (window as any).__engineBase as string | undefined; // e2e: this build's own engine
  if (override) return override;
  if (BUILD === 'dev' || !/\/v\/[^/]+\/verify\//.test(location.pathname)) return null;
  const id = build.replace(/^sha256-/, '').slice(0, 16);
  return new URL(`../../${id}/verify/?engine=1`, location.href).href;
}

/** Verifies `run` on another build's engine in a hidden frame; null if it isn't there or doesn't answer. */
function verifyOnEngine(url: string, run: RunFile): Promise<SegmentVerdict[] | null> {
  return new Promise((resolve) => {
    const frame = h('iframe', { src: url, style: { display: 'none' }, title: 'verify engine' }) as HTMLIFrameElement;
    const id = Math.random().toString(36).slice(2);
    const done = (v: SegmentVerdict[] | null) => {
      clearTimeout(timer);
      removeEventListener('message', onMsg);
      frame.remove();
      resolve(v);
    };
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== location.origin || e.source !== frame.contentWindow) return;
      if (e.data?.type === 'tbtge-engine-ready') frame.contentWindow!.postMessage({ type: 'tbtge-verify', id, run }, location.origin);
      else if (e.data?.type === 'tbtge-verdicts' && e.data.id === id && Array.isArray(e.data.verdicts)) done(e.data.verdicts);
    };
    const timer = setTimeout(() => done(null), 10_000);
    addEventListener('message', onMsg);
    document.body.append(frame);
  });
}

/** Every segment's verdict: on its own build where possible, otherwise on this build. */
async function verifyRun(run: RunFile, camp: Campaign): Promise<SegmentVerdict[]> {
  const out = new Map<Segment, SegmentVerdict>();
  const byBuild = new Map<string, Segment[]>();
  for (const s of run.segments) {
    const url = String(s.build) === BUILD ? null : engineUrl(String(s.build));
    if (!url) out.set(s, { ...verifySegment(camp, s, BUILD), checkedOn: 'this' });
    else byBuild.set(url, [...(byBuild.get(url) ?? []), s]);
  }
  await Promise.all(
    [...byBuild].map(async ([url, segs]) => {
      const v = await verifyOnEngine(url, { ...run, segments: segs });
      segs.forEach((s, i) => out.set(s, v?.[i] ? { ...v[i], checkedOn: 'own' } : { ...verifySegment(camp, s, BUILD), checkedOn: 'fallback' }));
    }),
  );
  return run.segments.map((s) => out.get(s)!);
}

function runEngine(): void {
  addEventListener('message', (e: MessageEvent) => {
    if (e.origin !== location.origin || e.data?.type !== 'tbtge-verify') return;
    const run = e.data.run as RunFile;
    const camp = campaignOf(run);
    const verdicts = run.segments.map((s) => verifySegment(camp, s, BUILD));
    (e.source as Window).postMessage({ type: 'tbtge-verdicts', id: e.data.id, build: BUILD, verdicts }, location.origin);
  });
  parent.postMessage({ type: 'tbtge-engine-ready' }, location.origin);
}

/** Levels in order; in a hot-seat party, the players of a round in turn order. */
const bySegment = (a: Segment, b: Segment) => a.level - b.level || (a.player ?? 0) - (b.player ?? 0);

const runLabel = (r: RunFile) => {
  const party = r.segments.some((s) => s.key.startsWith('party:'));
  const players = new Set(r.segments.map((s) => s.profileId ?? '')).size;
  return party
    ? `Party ${r.campaign.seed.slice(0, 8)} — ${players} players, ${Math.max(...r.segments.map((s) => s.level))} round(s)`
    : `Run ${r.campaign.seed.slice(0, 8)} — ${r.segments.length} level(s), up to level ${Math.max(...r.segments.map((s) => s.level))}`;
};

async function localRuns(): Promise<RunFile[]> {
  const segs = await allSegments().catch(() => [] as Segment[]);
  const by: Record<string, Segment[]> = {};
  for (const s of segs) (by[s.campaignSeed] ??= []).push(s);
  return Object.entries(by).map(([seed, list]) => ({ format: 'tbtge-run/1', build: list[0].build, campaign: { language: list[0].language, seed }, segments: list.sort(bySegment) }));
}

function chooser(runs: RunFile[]): void {
  const file = h('input', { type: 'file', accept: '.json,.proof,.png,application/json,image/png,image/*', 'data-verify': 'file' }) as HTMLInputElement;
  file.addEventListener('change', async () => {
    const f = file.files?.[0];
    if (!f) return;
    try {
      await openFile(f);
    } catch (e) {
      alert(`Could not read this file: ${(e as Error).message}`);
    }
  });
  ui.replaceChildren(
    h('div', { class: 'overlay' }, h('div', { class: 'card' },
      h('h1', {}, 'Verify & Re-play'),
      versionBadge(),
      h('p', {}, 'Pick a run saved on this device, or open a file someone shared with you: an artifact picture (PNG), a .proof file, a run file, or a screenshot of the artifact (fingerprint check only).'),
      h('div', { class: 'runs' }, ...(runs.length ? runs.map((r) => h('button', { class: 'secondary', onclick: () => void open(r) }, runLabel(r))) : [h('p', {}, 'No runs on this device yet.')])),
      h('p', {}, 'Open a file: ', file),
      h('p', {}, h('a', { href: '../', style: { color: 'white' } }, '← Back to the game')),
    )),
  );
}

/** A PNG (artifact with its proof, or a screenshot), a `.proof` file or a run file. */
async function openFile(f: File): Promise<void> {
  const bytes = new Uint8Array(await f.arrayBuffer());
  if (isPng(bytes) || f.type.startsWith('image/')) {
    const ring = await ringFromImage(f);
    const text = isPng(bytes) ? readITXt(bytes, PROOF_KEYWORD) : null;
    if (text) return openProof(parseProof(text), ring);
    return weakCheck(ring);
  }
  const text = new TextDecoder().decode(bytes);
  const data = JSON.parse(text);
  if (data?.format === PROOF_FORMAT) return openProof(parseProof(text), undefined);
  return open(data as RunFile);
}

/** Reads the code ring from a picture (null: no readable ring). */
async function ringFromImage(f: Blob): Promise<Uint8Array | null> {
  try {
    const bmp = await createImageBitmap(f);
    const c = document.createElement('canvas');
    c.width = bmp.width;
    c.height = bmp.height;
    const ctx = c.getContext('2d')!;
    ctx.drawImage(bmp, 0, 0);
    return readRing(ctx.getImageData(0, 0, c.width, c.height));
  } catch {
    return null;
  }
}

const sameStart = (a: Uint8Array, b: Uint8Array) => a.slice(0, 16).every((x, i) => x === b[i]);

/** Screenshot without a proof: show the fingerprint from the ring and look it up among this device's runs. */
async function weakCheck(ring: Uint8Array | null): Promise<void> {
  const runs = await localRuns();
  const matches = ring ? runs.filter((r) => sameStart(fingerprintBytes(runFingerprint(r.campaign, r.segments)), ring)) : [];
  (window as any).__verify.weak = { ring: ring ? shortFingerprint(ring) : null, matches: matches.length };
  ui.replaceChildren(
    h('div', { class: 'overlay' }, h('div', { class: 'card' },
      h('h1', {}, 'Fingerprint check'),
      ring
        ? h('div', {},
            h('p', { class: 'fingerprint' }, `Fingerprint from the picture's ring: ${shortFingerprint(ring)}`),
            matches.length
              ? h('div', {}, h('div', { class: 'verdict ok' }, `✅ This matches ${matches.length === 1 ? 'a run' : `${matches.length} runs`} on this device.`), ...matches.map((r) => h('button', { class: 'secondary', onclick: () => open(r) }, runLabel(r))))
              : h('div', { class: 'verdict warn' }, 'ℹ️ No run on this device has this fingerprint.'),
            h('p', {}, 'A screenshot only carries the fingerprint (a weak check). The original picture or the .proof file lets anyone re-simulate the whole run.'))
        : h('div', { class: 'verdict bad' }, '❌ No readable code ring in this picture.'),
      h('div', { class: 'row-btns' }, h('button', { class: 'secondary', onclick: () => location.reload() }, 'Other file')),
    )),
  );
}

interface ProofChecks {
  chain: boolean;
  summary: boolean;
  ring: boolean | null;
  identity: ProofBundle['identity'];
  proof: ProofBundle;
}

async function openProof(b: ProofBundle, ring: Uint8Array | null | undefined): Promise<void> {
  const run = await proofToRun(b);
  const sum = summarize(run);
  const checks: ProofChecks = {
    chain: runFingerprint(run.campaign, run.segments) === b.run,
    summary: JSON.stringify(sum) === JSON.stringify(b.summary),
    ring: ring === undefined ? null : !!ring && sameStart(fingerprintBytes(b.run), ring),
    identity: b.identity,
    proof: b,
  };
  return open(run, checks);
}

function proofView(c: ProofChecks): HTMLElement {
  const line = (ok: boolean, good: string, bad: string, key: string) => h('div', { class: `verdict ${ok ? 'ok' : 'bad'}`, 'data-check': key }, ok ? `✅ ${good}` : `❌ ${bad}`);
  const nameBox = h('span', {});
  if (c.identity.mode === 'hashed') {
    const input = h('input', { placeholder: 'Type the name to check', 'aria-label': 'Name to check', 'data-verify': 'name' }) as HTMLInputElement;
    const out = h('span', { 'data-verify': 'name-result' });
    const check = () => (out.textContent = input.value ? (nameMatches(c.proof, input.value) ? ' ✅ the name matches' : ' ❌ not this name') : '');
    input.addEventListener('input', check);
    nameBox.append('Hidden name: ', input, out);
  } else if (c.identity.mode === 'plain') nameBox.append(`Name: ${c.identity.name}`);
  return h('div', { class: 'verify-proof' },
    line(c.chain, `Run fingerprint ${shortFingerprint(fingerprintBytes(c.proof.run))} matches the re-simulated chain.`, 'The run fingerprint does not match the segments.', 'chain'),
    line(c.summary, 'Summary (stars, tiers, speed, accuracy, time) matches.', 'The summary does not match the re-simulated run.', 'summary'),
    c.ring === null ? null : line(c.ring, "The picture's code ring carries this fingerprint.", "The picture's code ring does not match this proof.", 'ring'),
    h('div', {}, nameBox));
}

function verdictView(v: SegmentVerdict[]): HTMLElement {
  const allOk = v.every((x) => x.ok);
  const sus = v.some((x) => x.timing.suspicious);
  const buildWarn = v.some((x) => !x.buildMatches && x.checkedOn !== 'own');
  const ownBuild = v.some((x) => x.checkedOn === 'own');
  return h('div', {},
    h('div', { class: `verdict ${allOk ? 'ok' : 'bad'}` }, allOk ? '✅ Verified: every level re-simulates to the same fingerprints, stars and results.' : '❌ Mismatch: this run does not re-simulate to the recorded fingerprints.'),
    sus ? h('div', { class: 'verdict warn' }, '⚠️ Suspicious timing: keystrokes look machine-generated. (A hint only — see docs.)') : null,
    ownBuild ? h('div', { class: 'verdict ok', 'data-check': 'own-build' }, '🧩 Levels recorded on other builds were re-simulated on the build that recorded them.') : null,
    buildWarn ? h('div', { class: 'verdict warn' }, `ℹ️ Some levels were recorded on a build that isn't available here. Checked with this build (${BUILD.slice(0, 16)}).`) : null,
    h('div', {}, ...v.map((x) => h('span', { style: { marginRight: '12px' } }, `${x.ok ? '✅' : '❌'} L${x.level}${x.player !== undefined ? ` P${x.player + 1}` : ''} ${x.letters} ${'★'.repeat(x.stars)}`))),
  );
}

async function open(run: RunFile, proof?: ProofChecks): Promise<void> {
  const camp = campaignOf(run);
  const segs = run.segments.slice().sort(bySegment);
  const verdicts = await verifyRun({ ...run, segments: segs }, camp);
  (window as any).__verify.verdicts = verdicts;
  (window as any).__verify.proof = proof ? { chain: proof.chain, summary: proof.summary, ring: proof.ring, identity: proof.identity.mode } : null;
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
  ui.replaceChildren(h('div', { class: 'verify-bar' }, verdictView(verdicts), proof ? proofView(proof) : null, h('div', { class: 'controls' }, play, speed, time, h('button', { class: 'secondary', onclick: () => location.reload() }, 'Other run')), seek));
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
    const plan = planOf(this.camp, this.segs[i]);
    const palette = palettes.find((p) => p.id === plan.paletteId) ?? palettes[0];
    const avatar = new AvatarRig(scales[0], this.segs[i].tier);
    host.setLevel({ templateId: plan.templateId, view: plan.view, styleId: plan.styleId, palette, havocIds: plan.havocIds, havocMaxP: plan.havocMaxP }, avatar, this.sim!, performance.now(), transition);
    this.hud?.el.remove();
    this.hud = new Hud(language(this.camp.language), { ...DEFAULT_SETTINGS, keyboard: 'off' });
    this.hud.keyboard.setKnown(plan.letters);
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

if (ENGINE) runEngine();
else void localRuns().then(chooser);

/** In-game HUD: rhythm frame, vignette, prompt, keyboard, stage dots, stars, power-ups (docs/07 HUD). */
import type { LevelSim } from '@/sim/level';
import type { LanguagePack } from '@/content/types';
import { KeyboardOverlay } from './keyboard';
import { h } from './dom';
import type { Settings } from '@/storage/profile';
import { versionBadge } from '@/app/build-info';

const PU_ICON: Record<string, string> = { 'powerup.shield': '🛡️', 'powerup.slow-mo': '🐢', 'powerup.reveal': '🔦' };

export class Hud {
  readonly el: HTMLDivElement;
  readonly keyboard: KeyboardOverlay;
  private vignette = h('div', { class: 'vignette' });
  private dim = h('div', { class: 'dim' });
  private fps = h('div', { class: 'fps hidden', 'aria-hidden': 'true' });
  private cache: Record<string, string> = {};
  private glow = h('div', { class: 'rhythm-glow' });
  private pulse = h('div', { class: 'rhythm-pulse' });
  private prompt = h('div', { class: 'prompt', 'aria-live': 'off' });
  private stages = h('div', { class: 'stages' });
  private stars = h('div', { class: 'stars' });
  private powerups = h('div', { class: 'powerups' });
  private stats = h('div', { class: 'stats' });
  private lastErrFrame = -1;
  private lastPromptKey = '';

  constructor(lang: LanguagePack, private settings: Settings) {
    this.keyboard = new KeyboardOverlay(lang);
    const top = h('div', { class: 'topbar' }, h('div', {}, this.stages, this.stats, versionBadge()), this.stars, this.powerups);
    this.el = h('div', { class: 'hud' }, this.dim, this.vignette, this.glow, this.pulse, top, this.prompt, this.keyboard.el, this.fps);
  }

  flash(ok: boolean): void {
    const p = this.pulse;
    p.classList.remove('ok', 'bad');
    void p.offsetWidth;
    p.classList.add(ok ? 'ok' : 'bad');
  }

  /** Write a value only when it changed (avoids layout/paint work every frame). */
  private set(key: string, value: string, apply: (v: string) => void): void {
    if (this.cache[key] === value) return;
    this.cache[key] = value;
    apply(value);
  }

  setFps(text: string | null): void {
    this.set('fps', text ?? '', (v) => {
      this.fps.textContent = v;
      this.fps.classList.toggle('hidden', !v);
    });
  }

  update(sim: LevelSim, _canvas?: HTMLCanvasElement): void {
    const s = sim.state;
    const vis = sim.visibility() / 1000;
    // Opacity changes are composited cheaply; a CSS filter on the WebGL canvas re-filters every frame.
    this.set('vig', (Math.max(0, 1 - vis) * 0.95).toFixed(2), (v) => (this.vignette.style.opacity = v));
    this.set('dim', (Math.max(0, 1 - vis) * 0.45).toFixed(2), (v) => (this.dim.style.opacity = v));
    const st = sim.steadinessP();
    const reduced = this.settings.reducedMotion;
    const size = Math.round((st / 1000) * 22);
    this.set('glow', String(size), () => {
      this.glow.style.setProperty('--glow-size', `${size}px`);
      this.glow.style.setProperty('--glow-blur', `${size * 2}px`);
    });
    this.set('glowmax', String(st >= 950 && !reduced), (v) => this.glow.classList.toggle('max', v === 'true'));
    // stage dots + stars
    const n = sim.setup.stageLengths.length;
    this.set('stages', `${s.stage}|${s.phase}`, () =>
      this.stages.replaceChildren(...Array.from({ length: n }, (_, i) => h('span', { class: i < Math.min(s.stage, n - 1) || (s.phase !== 'play' && s.phase !== 'intro') ? 'done' : i === Math.min(s.stage, n - 1) ? 'now' : '' }))),
    );
    this.set('stars', '★'.repeat(s.bestStars) + '☆'.repeat(Math.max(0, 3 - s.bestStars)), (v) => (this.stars.textContent = v));
    const f = s.frame;
    const pu: string[] = [];
    if (f < s.slowUntil) pu.push(PU_ICON['powerup.slow-mo']);
    if (f < s.shieldUntil && s.shieldCharges > 0) pu.push(`${PU_ICON['powerup.shield']}×${s.shieldCharges}`);
    if (f < s.revealUntil) pu.push(PU_ICON['powerup.reveal']);
    this.set('pu', pu.join('  '), (v) => (this.powerups.textContent = v));
    const sm = s.sm;
    const acc = sm.correct + sm.errors ? Math.floor((sm.correct * 100) / (sm.correct + sm.errors)) : 100;
    this.set('stats', `${(sim.liveWpmP() / 1000).toFixed(0)} wpm · ${acc}% · goal ${(sim.targetWpmP / 1000).toFixed(0)} wpm`, (v) => (this.stats.textContent = v));
    // keyboard
    const mode = this.settings.keyboard;
    this.set('kbmode', mode, (v) => this.keyboard.el.classList.toggle('hidden', v === 'off'));
    this.set('kbop', (mode === 'always' ? 1 : sim.keyboardOpacity() / 1000).toFixed(2), (v) => this.keyboard.setOpacity(Number(v)));
    const exp = s.phase === 'play' ? sim.expectedChars() : [];
    this.keyboard.setNext(exp[0], sim.idleHint());
    // prompt
    const errNow = f - this.lastErrFrame < 20;
    const key = `${s.prompt.pos}|${s.prompt.text.length}|${s.targets.map((t) => t.id + ':' + t.progress).join(',')}|${errNow}|${s.phase}`;
    if (key !== this.lastPromptKey) {
      this.lastPromptKey = key;
      this.renderPrompt(sim, errNow);
    }
  }

  markError(frame: number): void {
    this.lastErrFrame = frame;
  }

  private renderPrompt(sim: LevelSim, err: boolean): void {
    const s = sim.state;
    this.prompt.classList.toggle('hidden', s.phase !== 'play');
    if (sim.setup.inputMode === 'targeting') {
      const parts = s.targets.map((t) => {
        const locked = s.lockedTarget === t.id;
        return h('span', { class: locked ? 'locked' : '' }, h('span', { class: 'typed' }, t.text.slice(0, t.progress)), t.text.slice(t.progress), '   ');
      });
      this.prompt.replaceChildren(...parts);
      return;
    }
    const p = s.prompt;
    const from = Math.max(0, p.pos - 8);
    const to = Math.min(p.text.length, p.pos + 24);
    const nodes: Node[] = [];
    for (let i = from; i < to; i++) {
      const ch = p.text[i];
      const special = p.spans.some((sp) => i >= sp.start && i < sp.end);
      const cls = [i < p.pos ? 'typed' : '', i === p.pos ? (err ? 'cur err' : 'cur') : '', special ? 'special' : '', ch === ' ' ? 'space' : ''].filter(Boolean).join(' ');
      nodes.push(h('span', { class: cls }, ch === ' ' ? '·' : ch));
    }
    this.prompt.replaceChildren(...nodes);
  }
}

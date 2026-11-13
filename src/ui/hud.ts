/** In-game HUD: rhythm frame, vignette, prompt, keyboard, stage dots, stars, power-ups (docs/07 HUD). */
import type { LevelSim } from '@/sim/level';
import type { LanguagePack } from '@/content/types';
import { KeyboardOverlay } from './keyboard';
import { h } from './dom';
import type { Settings } from '@/storage/profile';

const PU_ICON: Record<string, string> = { 'powerup.shield': '🛡️', 'powerup.slow-mo': '🐢', 'powerup.reveal': '🔦' };

export class Hud {
  readonly el: HTMLDivElement;
  readonly keyboard: KeyboardOverlay;
  private vignette = h('div', { class: 'vignette' });
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
    const top = h('div', { class: 'topbar' }, h('div', {}, this.stages, this.stats), this.stars, this.powerups);
    this.el = h('div', { class: 'hud' }, this.vignette, this.glow, this.pulse, top, this.prompt, this.keyboard.el);
  }

  flash(ok: boolean): void {
    const p = this.pulse;
    p.classList.remove('ok', 'bad');
    void p.offsetWidth;
    p.classList.add(ok ? 'ok' : 'bad');
  }

  update(sim: LevelSim, canvas: HTMLCanvasElement): void {
    const s = sim.state;
    const vis = sim.visibility() / 1000;
    this.vignette.style.opacity = String(Math.max(0, 1 - vis) * 0.95);
    canvas.style.filter = `saturate(${0.15 + vis * 0.85}) brightness(${0.55 + vis * 0.45})`;
    const st = sim.steadinessP();
    const reduced = this.settings.reducedMotion;
    const size = Math.round((st / 1000) * 22);
    this.glow.style.setProperty('--glow-size', `${size}px`);
    this.glow.style.setProperty('--glow-blur', `${size * 2}px`);
    this.glow.classList.toggle('max', st >= 950 && !reduced);
    // stage dots + stars
    const n = sim.setup.stageLengths.length;
    this.stages.replaceChildren(...Array.from({ length: n }, (_, i) => h('span', { class: i < Math.min(s.stage, n - 1) || (s.phase !== 'play' && s.phase !== 'intro') ? 'done' : i === Math.min(s.stage, n - 1) ? 'now' : '' })));
    this.stars.textContent = '★'.repeat(s.bestStars) + '☆'.repeat(Math.max(0, 3 - s.bestStars));
    const f = s.frame;
    const pu: string[] = [];
    if (f < s.slowUntil) pu.push(PU_ICON['powerup.slow-mo']);
    if (f < s.shieldUntil && s.shieldCharges > 0) pu.push(`${PU_ICON['powerup.shield']}×${s.shieldCharges}`);
    if (f < s.revealUntil) pu.push(PU_ICON['powerup.reveal']);
    this.powerups.textContent = pu.join('  ');
    const sm = s.sm;
    const acc = sm.correct + sm.errors ? Math.floor((sm.correct * 100) / (sm.correct + sm.errors)) : 100;
    this.stats.textContent = `${(sim.liveWpmP() / 1000).toFixed(0)} wpm · ${acc}% · goal ${(sim.targetWpmP / 1000).toFixed(0)} wpm`;
    // keyboard
    const mode = this.settings.keyboard;
    this.keyboard.el.classList.toggle('hidden', mode === 'off');
    this.keyboard.setOpacity(mode === 'always' ? 1 : sim.keyboardOpacity() / 1000);
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

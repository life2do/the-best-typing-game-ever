/**
 * Stretch break (docs/07 Accessibility → break reminder). A two-minute (configurable) countdown shown
 * as a number and as a ring filling around the player's own avatar, which demonstrates a stretch for
 * each part of the break. The break can't be ended early: every early click or key press shows one of
 * the language pack's supportive phrases instead.
 */
import * as THREE from 'three';
import { h } from './dom';
import { AvatarRig, stretchPose } from '@/avatar/procedural';
import type { LanguagePack, StretchMove } from '@/content/types';
import type { Voice } from '@/audio/audio';

export interface StretchBreakOptions {
  seconds: number;
  lang: LanguagePack;
  avatar: AvatarRig | null;
  voice?: Voice;
  reducedMotion?: boolean;
  onDone: () => void;
}

const RING_R = 130;
const RING_C = 2 * Math.PI * RING_R;
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const FALLBACK_STEPS: { move: StretchMove; icon: string; text: string }[] = [{ move: 'breathe', icon: '🌬️', text: 'Take a deep breath' }];
const FALLBACK_NUDGES = ['Not yet! Breaks help you get faster.'];

export class StretchBreak {
  readonly el: HTMLElement;
  private elapsed = 0;
  private last = 0;
  private raf = 0;
  private done = false;
  private lastNudge = -1;
  private stepIndex = -1;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  private ring: SVGCircleElement;
  private count = h('div', { class: 'break-count', 'aria-live': 'off' });
  private stepText = h('div', { class: 'break-step', 'aria-live': 'polite' });
  private nudge = h('div', { class: 'break-nudge', role: 'status' });
  private button: HTMLButtonElement;
  private emoji = h('div', { class: 'break-emoji' });
  private steps;
  private nudges;
  private keyHandler = (e: KeyboardEvent) => this.onKey(e);

  constructor(private readonly o: StretchBreakOptions) {
    this.steps = o.lang.stretchSteps?.length ? o.lang.stretchSteps : FALLBACK_STEPS;
    this.nudges = o.lang.breakNudges?.length ? o.lang.breakNudges : FALLBACK_NUDGES;
    const ui = o.lang.ui ?? {};
    const svgNs = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNs, 'svg');
    svg.setAttribute('viewBox', '0 0 300 300');
    svg.setAttribute('class', 'break-ring');
    const track = document.createElementNS(svgNs, 'circle');
    this.ring = document.createElementNS(svgNs, 'circle');
    for (const c of [track, this.ring]) {
      c.setAttribute('cx', '150');
      c.setAttribute('cy', '150');
      c.setAttribute('r', String(RING_R));
      svg.append(c);
    }
    track.setAttribute('class', 'track');
    this.ring.setAttribute('class', 'fill');
    this.ring.style.strokeDasharray = String(RING_C);
    this.ring.style.strokeDashoffset = String(RING_C);
    const canvas = h('canvas', { width: 220, height: 220, class: 'break-avatar' });
    const stage = h('div', { class: 'break-stage' }, svg, canvas, this.emoji);
    this.button = h('button', { class: 'break-button waiting', onclick: () => this.tryFinish() }, `${ui.breakWait ?? 'Ready in'} ${fmt(o.seconds)}`);
    this.el = h(
      'div',
      { class: 'overlay break' },
      h('div', { class: 'card' }, h('h2', {}, `🙆 ${ui.breakTitle ?? 'Stretch break!'}`), stage, this.count, this.stepText, this.nudge, h('div', { class: 'row-btns' }, this.button)),
    );
    this.setupAvatar(canvas);
    addEventListener('keydown', this.keyHandler, { capture: true });
    this.raf = requestAnimationFrame((t) => this.frame(t));
  }

  private setupAvatar(canvas: HTMLCanvasElement): void {
    if (!this.o.avatar) return;
    try {
      this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
      this.renderer.setSize(220, 220, false);
      const sun = new THREE.DirectionalLight(0xffffff, 1.6);
      sun.position.set(2, 4, 3);
      this.scene.add(new THREE.AmbientLight(0xffffff, 1.4), sun);
      this.scene.add(this.o.avatar.root);
      this.camera.position.set(0, 1.0, 3.1); // close-up so the stretches are easy to follow
      this.camera.lookAt(0, 0.75, 0);
    } catch {
      this.renderer = null; // no WebGL: the step emoji is shown instead
    }
  }

  /** Called for Escape (routed by the game) and early clicks. */
  tryFinish(): void {
    if (this.done) return this.finish();
    let i = Math.floor(Math.random() * this.nudges.length);
    if (this.nudges.length > 1 && i === this.lastNudge) i = (i + 1) % this.nudges.length;
    this.lastNudge = i;
    this.nudge.textContent = this.nudges[i];
    for (const el of [this.nudge, this.button]) {
      el.classList.remove('shake');
      void el.offsetWidth;
      el.classList.add('shake');
    }
  }

  private onKey(e: KeyboardEvent): void {
    if (e.code === 'Escape' || e.repeat || /^(Shift|Control|Alt|Meta|CapsLock|Tab)/.test(e.code)) return; // Escape is routed by the game
    e.preventDefault();
    e.stopPropagation();
    if (this.done && (e.code === 'Enter' || e.code === 'Space')) this.finish();
    else if (!this.done) this.tryFinish();
  }

  private frame(now: number): void {
    this.raf = requestAnimationFrame((t) => this.frame(t));
    // Real time, even on slow machines; long gaps (tab in the background) are capped and hidden time doesn't count.
    const dt = this.last ? Math.min(1000, now - this.last) / 1000 : 0;
    this.last = now;
    if (!document.hidden && !this.done) this.elapsed += dt; // the timer only runs while the break is visible
    const total = this.o.seconds;
    const left = Math.max(0, total - this.elapsed);
    const frac = Math.min(1, this.elapsed / total);
    this.ring.style.strokeDashoffset = String(RING_C * (1 - frac));
    const shown = fmt(Math.ceil(left));
    if (this.count.textContent !== shown) {
      this.count.textContent = shown;
      this.count.classList.remove('tick');
      void this.count.offsetWidth;
      this.count.classList.add('tick');
    }
    const step = Math.min(this.steps.length - 1, Math.floor(frac * this.steps.length));
    const s = this.steps[step];
    if (step !== this.stepIndex) {
      this.stepIndex = step;
      this.stepText.textContent = `${s.icon ?? ''} ${s.text}`;
      this.emoji.textContent = s.icon ?? '🙆';
      this.emoji.classList.toggle('hidden', !!this.renderer);
      this.o.voice?.speak(s.text);
    }
    if (left <= 0 && !this.done) {
      this.done = true;
      const ui = this.o.lang.ui ?? {};
      this.el.classList.add('done');
      this.button.classList.remove('waiting');
      this.button.textContent = ui.breakReady ?? "I'm ready! ▶";
      this.nudge.textContent = ui.breakDone ?? 'Great stretching!';
      this.stepText.textContent = '🎉';
      this.o.voice?.speak(ui.breakDone ?? 'Great stretching!');
      this.button.focus();
    } else if (!this.done) {
      this.button.textContent = `${this.o.lang.ui?.breakWait ?? 'Ready in'} ${shown}`;
    }
    if (this.renderer && this.o.avatar) {
      stretchPose(this.o.avatar, this.done ? 'breathe' : s.move, now / 1000, this.o.reducedMotion);
      this.renderer.render(this.scene, this.camera);
    }
  }

  private finish(): void {
    this.destroy();
    this.o.onDone();
  }

  get finished(): boolean {
    return this.done;
  }

  destroy(): void {
    cancelAnimationFrame(this.raf);
    removeEventListener('keydown', this.keyHandler, { capture: true });
    if (this.o.avatar) this.scene.remove(this.o.avatar.root);
    this.renderer?.dispose();
    this.el.remove();
  }
}

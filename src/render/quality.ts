/**
 * Automatic quality scaler with no upper limit (docs/08 Quality scaler): steps the render resolution
 * up while frame time is under budget, down on spikes. Never affects the simulation.
 */
import type * as THREE from 'three';

export class QualityScaler {
  pixelRatio: number;
  override: number | null = null;
  lite = false;
  private last = 0;
  private ema = 16;
  private sinceChange = 0;
  private blockUpUntil = 0;

  constructor(private readonly renderer: THREE.WebGLRenderer) {
    this.pixelRatio = Math.min(devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(this.pixelRatio);
  }

  setOverride(pr: number | null): void {
    this.override = pr;
    this.apply(pr ?? this.pixelRatio);
  }

  private apply(pr: number): void {
    this.pixelRatio = pr;
    this.renderer.setPixelRatio(pr);
    const c = this.renderer.domElement;
    this.renderer.setSize(c.clientWidth || innerWidth, c.clientHeight || innerHeight, false);
  }

  tick(now: number): void {
    if (this.last) {
      const dt = now - this.last;
      if (dt > 0 && dt < 250) this.ema = this.ema * 0.95 + dt * 0.05;
    }
    this.last = now;
    if (this.override !== null || ++this.sinceChange < 90) return;
    const dpr = devicePixelRatio || 1;
    if (this.ema > 22 && this.pixelRatio > 0.5) {
      this.apply(Math.max(0.5, this.pixelRatio - 0.25));
      this.sinceChange = 0;
      this.blockUpUntil = now + 10_000;
    } else if (this.ema < 17.5 && now > this.blockUpUntil && this.pixelRatio < dpr * 3) {
      // No hard ceiling: keep supersampling while the machine has headroom.
      this.apply(this.pixelRatio + 0.25);
      this.sinceChange = 0;
    }
    this.lite = this.pixelRatio <= 0.75;
  }

  get frameMs(): number {
    return this.ema;
  }
}

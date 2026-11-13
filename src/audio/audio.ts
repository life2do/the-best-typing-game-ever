/**
 * Procedural music and effects with Web Audio (docs/08): every correct key plucks a note from a
 * pentatonic scale, so the player *is* the beat. Layers (bass pulse, hi-hat, pad) fade in as rhythm
 * steadiness rises; slow-mo pitches everything down.
 */
const PENTA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private music!: GainNode;
  private sfx!: GainNode;
  private pad: OscillatorNode[] = [];
  private padGain!: GainNode;
  private lastBass = 0;
  musicVolume = 0.5;
  sfxVolume = 0.7;
  private root = 57; // A3

  /** Must be called from a user gesture. */
  unlock(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.music = ctx.createGain();
    this.sfx = ctx.createGain();
    this.music.connect(ctx.destination);
    this.sfx.connect(ctx.destination);
    this.padGain = ctx.createGain();
    this.padGain.gain.value = 0;
    this.padGain.connect(this.music);
    for (const semis of [0, 7, 12]) {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = this.freq(this.root - 12 + semis);
      o.connect(this.padGain);
      o.start();
      this.pad.push(o);
    }
    this.setVolumes(this.musicVolume, this.sfxVolume);
  }

  setVolumes(music: number, sfx: number): void {
    this.musicVolume = music;
    this.sfxVolume = sfx;
    if (!this.ctx) return;
    this.music.gain.value = music * 0.6;
    this.sfx.gain.value = sfx * 0.6;
  }

  private freq(midi: number): number {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  private tone(midi: number, dur: number, type: OscillatorType, vol: number, out: GainNode, when = 0, slide = 0): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(this.freq(midi), t);
    if (slide) o.frequency.exponentialRampToValueAtTime(this.freq(midi + slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(out);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  private noise(dur: number, vol: number, when = 0): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const t = ctx.currentTime + when;
    const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 6000;
    const g = ctx.createGain();
    g.gain.value = vol;
    src.connect(hp).connect(g).connect(this.music);
    src.start(t);
  }

  /** A correct key: pluck + rhythm layers. steadiness and intervalMs drive the groove. */
  correct(char: string, steadinessP: number, intervalMs: number, slow: boolean): void {
    if (!this.ctx) return;
    const shift = slow ? -12 : 0;
    const idx = (char.codePointAt(0) ?? 0) % PENTA.length;
    this.tone(this.root + 12 + PENTA[idx] + shift, 0.25, 'triangle', 0.22, this.music);
    const now = this.ctx.currentTime;
    if (steadinessP > 600 && now - this.lastBass > (intervalMs / 1000) * 1.9) {
      this.lastBass = now;
      this.tone(this.root - 12 + shift, 0.3, 'sine', 0.35, this.music);
    }
    if (steadinessP > 800) this.noise(0.04, 0.12);
    this.padGain.gain.setTargetAtTime(steadinessP > 500 ? 0.05 : 0.0, now, 0.8);
    for (const o of this.pad) o.detune.setTargetAtTime(slow ? -1200 : 0, now, 0.3);
  }

  error(): void {
    this.tone(40, 0.18, 'square', 0.12, this.sfx, 0, -5);
  }

  powerup(): void {
    [0, 4, 7, 12].forEach((s, i) => this.tone(this.root + 12 + s, 0.18, 'sine', 0.2, this.sfx, i * 0.07));
  }

  stage(stars: number): void {
    [0, 4, 7].forEach((s, i) => this.tone(this.root + s + (stars >= 2 ? 12 : 0), 0.6, 'triangle', 0.18, this.sfx, i * 0.02));
  }

  fanfare(): void {
    [0, 4, 7, 12, 16, 19, 24].forEach((s, i) => this.tone(this.root + s, 0.3, 'triangle', 0.2, this.sfx, i * 0.09));
  }

  whoosh(): void {
    this.tone(this.root - 24, 1.6, 'sawtooth', 0.05, this.sfx, 0, 36);
  }
}

/** Text-to-speech via speechSynthesis (docs/07 Voice). Voice effects = pitch/rate/voice choice. */
export class Voice {
  enabled = true;
  pitch = 1;
  rate = 1;
  constructor(public lang = 'en-US', private preferred: string[] = []) {}

  speak(text: string, interrupt = true): void {
    if (!this.enabled || typeof speechSynthesis === 'undefined') return;
    if (interrupt) speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = this.lang;
    u.pitch = this.pitch;
    u.rate = this.rate;
    const voices = speechSynthesis.getVoices().filter((v) => v.lang.startsWith(this.lang.slice(0, 2)));
    u.voice = voices.find((v) => this.preferred.includes(v.name)) ?? voices[0] ?? null;
    speechSynthesis.speak(u);
  }

  available(): boolean {
    return typeof speechSynthesis !== 'undefined' && speechSynthesis.getVoices().some((v) => v.lang.startsWith(this.lang.slice(0, 2)));
  }
}

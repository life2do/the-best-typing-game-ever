/**
 * Procedural music with Web Audio (docs/08). The player *is* the beat, but the notes are musical:
 * each correct key plays the next tone of an arpeggio over a gentle chord progression
 * (I–V–vi–IV, changing every 8 keys), through a low-pass filter and a soft generated reverb.
 * A warm pad follows the chords and only fades in while the rhythm is steady; a soft bass joins
 * on the first key of each bar. Slow-mo drops everything an octave.
 */
const PROGRESSION = [
  [0, 4, 7, 11], // Imaj7
  [7, 11, 14, 17], // V
  [9, 12, 16, 19], // vi7
  [5, 9, 12, 16], // IVmaj7
];
const ARP = [0, 1, 2, 3, 2, 1, 2, 3];
const KEYS_PER_CHORD = 8;

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private music!: GainNode;
  private sfx!: GainNode;
  private wet!: GainNode;
  private tone!: BiquadFilterNode;
  private padGain!: GainNode;
  private pad: OscillatorNode[] = [];
  private step = 0;
  musicVolume = 0.35;
  sfxVolume = 0.6;
  private root = 60; // C4

  /** Must be called from a user gesture. */
  unlock(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.master = ctx.createGain();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    this.master.connect(comp).connect(ctx.destination);
    this.tone = ctx.createBiquadFilter();
    this.tone.type = 'lowpass';
    this.tone.frequency.value = 2400;
    this.tone.Q.value = 0.3;
    this.music = ctx.createGain();
    this.sfx = ctx.createGain();
    this.music.connect(this.tone).connect(this.master);
    this.sfx.connect(this.master);
    // Soft reverb from a generated impulse response.
    const reverb = ctx.createConvolver();
    reverb.buffer = this.impulse(2.2);
    this.wet = ctx.createGain();
    this.wet.gain.value = 0.28;
    this.tone.connect(reverb).connect(this.wet).connect(this.master);
    this.padGain = ctx.createGain();
    this.padGain.gain.value = 0;
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 700;
    this.padGain.connect(padFilter).connect(this.music);
    for (let i = 0; i < 3; i++) {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = this.freq(this.root - 12 + PROGRESSION[0][i]);
      o.connect(this.padGain);
      o.start();
      this.pad.push(o);
    }
    this.setVolumes(this.musicVolume, this.sfxVolume);
  }

  private impulse(seconds: number): AudioBuffer {
    const ctx = this.ctx!;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    return buf;
  }

  setVolumes(music: number, sfx: number): void {
    this.musicVolume = music;
    this.sfxVolume = sfx;
    if (!this.ctx) return;
    this.music.gain.value = music * 0.5;
    this.sfx.gain.value = sfx * 0.5;
  }

  private freq(midi: number): number {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  /** A soft plucked note: sine + quiet octave triangle, fast attack, smooth decay. */
  private note(midi: number, dur: number, vol: number, out: GainNode, when = 0, type: OscillatorType = 'sine', slide = 0): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const t = ctx.currentTime + when;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    g.connect(out);
    const parts: [OscillatorType, number, number][] = type === 'sine' ? [['sine', 0, 1], ['triangle', 12, 0.18]] : [[type, 0, 1]];
    for (const [ty, oct, amp] of parts) {
      const o = ctx.createOscillator();
      const og = ctx.createGain();
      og.gain.value = amp;
      o.type = ty;
      o.frequency.setValueAtTime(this.freq(midi + oct), t);
      if (slide) o.frequency.exponentialRampToValueAtTime(this.freq(midi + oct + slide), t + dur);
      o.connect(og).connect(g);
      o.start(t);
      o.stop(t + dur + 0.05);
    }
  }

  /** A correct key: next arpeggio note; steadiness brings in the pad and bass. */
  correct(_char: string, steadinessP: number, _intervalMs: number, slow: boolean): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const chordIdx = Math.floor(this.step / KEYS_PER_CHORD) % PROGRESSION.length;
    const chord = PROGRESSION[chordIdx];
    const pos = this.step % KEYS_PER_CHORD;
    const shift = slow ? -12 : 0;
    this.note(this.root + chord[ARP[pos]] + shift, 0.45, 0.16, this.music);
    if (pos === 0) {
      if (steadinessP > 550) this.note(this.root - 24 + chord[0] + shift, 0.9, 0.2, this.music);
      const now = ctx.currentTime;
      this.pad.forEach((o, i) => o.frequency.setTargetAtTime(this.freq(this.root - 12 + chord[i] + shift), now, 0.15));
    }
    this.padGain.gain.setTargetAtTime(steadinessP > 600 ? 0.06 : 0, ctx.currentTime, 0.6);
    this.step++;
  }

  /** Gentle "bonk": low, short, no harsh square wave. */
  error(): void {
    this.note(this.root - 17, 0.22, 0.12, this.sfx, 0, 'sine', -3);
  }

  powerup(): void {
    [0, 4, 7, 12].forEach((s, i) => this.note(this.root + 12 + s, 0.3, 0.1, this.sfx, i * 0.06));
  }

  collect(): void {
    this.note(this.root + 24, 0.25, 0.08, this.sfx);
    this.note(this.root + 31, 0.3, 0.06, this.sfx, 0.05);
  }

  stage(stars: number): void {
    const chord = stars >= 2 ? [0, 4, 7, 12] : [0, 4, 7];
    chord.forEach((s, i) => this.note(this.root + s, 0.9, 0.08, this.sfx, i * 0.03));
  }

  fanfare(): void {
    [0, 4, 7, 12, 16, 19, 24].forEach((s, i) => this.note(this.root + s, 0.5, 0.09, this.sfx, i * 0.08));
  }

  whoosh(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.impulse(1.2);
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.setValueAtTime(300, t);
    f.frequency.exponentialRampToValueAtTime(3000, t + 1.2);
    const g = ctx.createGain();
    g.gain.value = 0.25;
    src.connect(f).connect(g).connect(this.sfx);
    src.start(t);
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

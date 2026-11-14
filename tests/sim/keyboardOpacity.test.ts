/** Keyboard overlay visibility = reverse of recent accuracy, capped: 100% at <= 20%, 0% at >= 80%. */
import { describe, expect, it } from 'vitest';
import { runTemplate } from '../helpers/bot';

const at = (accP: number) => {
  const { run } = runTemplate('template.pulse-runner', 'fj', 4, 'pass');
  const sim = run.sim;
  const n = 50;
  const good = Math.round((accP * n) / 1000);
  sim.state.win.recent = Array.from({ length: n }, (_, i) => (i < good ? 1 : 0));
  sim.state.phase = 'done'; // no idle hint / stuck override
  return sim.keyboardOpacity();
};

describe('keyboard overlay opacity', () => {
  it('is the reverse of accuracy between the caps', () => {
    expect(at(0)).toBe(1000);
    expect(at(200)).toBe(1000);
    expect(at(500)).toBe(500);
    expect(at(800)).toBe(0);
    expect(at(1000)).toBe(0);
  });
  it('is fully visible before any keystroke', () => {
    const { run } = runTemplate('template.pulse-runner', 'fj', 4, 'pass');
    run.sim.state.win.recent = [];
    expect(run.sim.keyboardOpacity()).toBe(1000);
  });
});

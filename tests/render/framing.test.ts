/**
 * HUD-safe framing: the typing prompt and the keyboard cover the bottom ~38% of the screen (and the
 * stars/stats line the top ~8%), so a level's play area must be framed between those. Regression for
 * bubble-popper, whose bubbles rose from under the keyboard.
 */
import { describe, expect, it } from 'vitest';
import { BUBBLE_SPAN, CAMERA_Y, COL_X, FRAME_HEIGHT, LABEL_H } from '../../content/templates/bubble-popper/view';

/** Screen position (0 = top, 1 = bottom) of world height y in a 2D view. */
const screenY = (y: number) => 0.5 - (y - CAMERA_Y) / FRAME_HEIGHT;
const HUD_TOP = 0.62; // top edge of the typing prompt at 1280×800
const STATS_BOTTOM = 0.08;

describe('bubble-popper framing', () => {
  it('every bubble, from the floor to the surface, stays above the prompt and keyboard', () => {
    expect(screenY(BUBBLE_SPAN.bottom)).toBeLessThan(HUD_TOP);
    expect(screenY(BUBBLE_SPAN.top)).toBeGreaterThan(STATS_BOTTOM);
  });

  it('columns fit a 4:3 screen and are far enough apart for word labels', () => {
    const halfWidth = (FRAME_HEIGHT * 4) / 3 / 2;
    expect(Math.max(...COL_X.map(Math.abs)) + 1).toBeLessThan(halfWidth);
    for (let i = 1; i < COL_X.length; i++) expect(COL_X[i] - COL_X[i - 1]).toBeGreaterThan(LABEL_H * 3.5);
  });
});

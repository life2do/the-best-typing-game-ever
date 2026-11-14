/**
 * How a typed character is shown on screen (world labels, prompt, keyboard, intro). Editing keys are
 * characters in the text (`\b` Backspace, `\n` Enter, `\t` Tab) but are drawn as symbols. Space has its
 * own space-bar drawing (D55) and is handled where it is drawn.
 */
export const KEY_GLYPHS: Record<string, string> = { '\b': '⌫', '\n': '⏎', '\t': '⇥' };

export const displayGlyph = (ch: string): string => KEY_GLYPHS[ch] ?? ch;

/** A whole chunk of text for display (editing keys as symbols). */
export const displayText = (s: string): string => s.replace(/[\b\n\t]/g, (c) => KEY_GLYPHS[c]);

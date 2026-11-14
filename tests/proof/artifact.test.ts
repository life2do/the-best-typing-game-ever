/** M2.10: fingerprint, traits, code ring, PNG chunk, proof bundle and tesseract geometry. */
import { describe, expect, it } from 'vitest';
import { campaignFor, levelSetup } from '@/campaign/setup';
import { templateSim } from '@/sim/templates';
import { verifySegment, type RunFile } from '@/app/replay';
import type { Segment } from '@/storage/profile';
import { fingerprintBytes, runFingerprint, shortFingerprint } from '@/proof/fingerprint';
import { traitsFrom, PLANES, GLYPH_SLOTS } from '@/proof/traits';
import { RING_CELLS, RING_RADIUS, RING_WIDTH, bitsToFingerprint, cellAngle, readRing, ringBits } from '@/proof/ring';
import { addITXt, crc32, readITXt } from '@/proof/png';
import { buildProof, nameHash, nameMatches, packLog, parseProof, proofToRun, unpackLog } from '@/proof/bundle';
import { EDGES, VERTICES, frame, rotate } from '@/artifact/tesseract';
import { runBot } from '../../tools/bot/bot';

function botRun(seed = 'artifact-seed'): RunFile {
  const camp = campaignFor(seed);
  const segments: Segment[] = [1, 2].map((level) => {
    const setup = levelSetup(camp, level, { tier: 3 });
    const r = runBot(setup, templateSim(setup.templateId), { profile: 'pass', botSeed: `${seed}:${level}` });
    return {
      key: `${seed}:${level}`, build: 'test', campaignSeed: seed, language: 'en', level, tier: 3, targetStars: 1, collected: [], weakKeys: [],
      log: r.log, snapshots: r.sim.snapshots.map((s) => s.hash), complete: r.completed, stars: r.sim.state.bestStars, startedAt: level, plan: camp.levels[level - 1],
    };
  });
  return { format: 'tbtge-run/1', build: 'test', campaign: { language: 'en', seed }, segments };
}

describe('run fingerprint and traits', () => {
  it('is a chain over every snapshot, in level order, and changes with any of them', () => {
    const run = botRun();
    const fp = runFingerprint(run.campaign, run.segments);
    expect(fp).toMatch(/^sha256-/);
    expect(runFingerprint(run.campaign, run.segments.slice().reverse())).toBe(fp);
    const tampered = run.segments.map((s, i) => (i === 1 ? { ...s, snapshots: [...s.snapshots.slice(0, -1), s.snapshots[0]] } : s));
    expect(runFingerprint(run.campaign, tampered)).not.toBe(fp);
    expect(runFingerprint({ language: 'en', seed: 'other' }, run.segments)).not.toBe(fp);
    expect(fingerprintBytes(fp)).toHaveLength(32);
    expect(shortFingerprint(fingerprintBytes(fp))).toMatch(/^([0-9a-f]{8} ){3}[0-9a-f]{8}$/);
  });

  it('derives the same traits from the same fingerprint and valid, varied ones across runs', () => {
    const a = traitsFrom(fingerprintBytes(runFingerprint({ language: 'en', seed: 'a' }, [])));
    expect(traitsFrom(fingerprintBytes(runFingerprint({ language: 'en', seed: 'a' }, [])))).toEqual(a);
    expect(a.planes[0]).not.toBe(a.planes[1]);
    expect(a.planes.every((p) => PLANES.includes(p))).toBe(true);
    expect(a.layout.slice().sort((x, y) => x - y)).toEqual(Array.from({ length: GLYPH_SLOTS }, (_, k) => k));
    const many = ['b', 'c', 'd', 'e', 'f', 'g'].map((s) => traitsFrom(fingerprintBytes(runFingerprint({ language: 'en', seed: s }, []))));
    expect(new Set(many.map((t) => t.hues[0])).size).toBeGreaterThan(3);
    expect(new Set(many.map((t) => t.planes.join())).size).toBeGreaterThan(2);
  });
});

/** Rasterises the ring like drawRing does, at any size, onto a dark background (with the tesseract area noisy). */
function rasterRing(size: number, bits: number[]): { width: number; height: number; data: Uint8ClampedArray } {
  const data = new Uint8ClampedArray(size * size * 4);
  const r = size * RING_RADIUS;
  const half = (size * RING_WIDTH) / 2;
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const dx = x + 0.5 - size / 2;
      const dy = y + 0.5 - size / 2;
      const d = Math.hypot(dx, dy);
      let v = 20 + ((x * 7 + y * 13) % 40); // background texture
      if (Math.abs(d - r) <= half) {
        let a = Math.atan2(dx, -dy);
        if (a < 0) a += Math.PI * 2;
        const cell = Math.floor((a / (Math.PI * 2)) * RING_CELLS) % RING_CELLS;
        const inCell = (a / (Math.PI * 2)) * RING_CELLS - Math.floor((a / (Math.PI * 2)) * RING_CELLS);
        if (inCell > 0.09 && inCell < 0.91) v = bits[cell] ? 235 : 70;
      }
      const o = (y * size + x) * 4;
      data[o] = v;
      data[o + 1] = v;
      data[o + 2] = v;
      data[o + 3] = 255;
    }
  return { width: size, height: size, data };
}

describe('code ring', () => {
  const fp = fingerprintBytes(runFingerprint({ language: 'en', seed: 'ring' }, []));
  it('encodes version + 128 bits + CRC and decodes them back', () => {
    const bits = ringBits(fp);
    expect(bits).toHaveLength(RING_CELLS);
    expect(Array.from(bitsToFingerprint(bits)!)).toEqual(Array.from(fp.slice(0, 16)));
    const flipped = bits.slice();
    flipped[40] ^= 1;
    expect(bitsToFingerprint(flipped)).toBeNull(); // CRC catches a misread
  });

  it('is read back from the picture at full size and from a small screenshot', () => {
    for (const size of [1024, 360]) {
      const got = readRing(rasterRing(size, ringBits(fp)));
      expect(got && Array.from(got), `size ${size}`).toEqual(Array.from(fp.slice(0, 16)));
    }
    const blank = rasterRing(200, Array(RING_CELLS).fill(0));
    expect(readRing(blank)).toBeNull();
    expect(cellAngle(0)).toBeGreaterThan(0);
  });
});

// 1×1 transparent PNG
const PNG = Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='), (c) => c.charCodeAt(0));

describe('PNG iTXt chunk', () => {
  it('stores and reads back UTF-8 text with a valid CRC, before IEND', () => {
    const text = JSON.stringify({ hello: 'мир ✨', n: 1 });
    const out = addITXt(PNG, 'tbtge-proof', text);
    expect(readITXt(out, 'tbtge-proof')).toBe(text);
    expect(readITXt(out, 'other')).toBeNull();
    expect(readITXt(PNG, 'tbtge-proof')).toBeNull();
    // IEND stays last; the new chunk's CRC covers type + data.
    expect(String.fromCharCode(...out.slice(-8, -4))).toBe('IEND');
    const len = new DataView(out.buffer).getUint32(PNG.length - 12);
    const start = PNG.length - 12;
    const crc = new DataView(out.buffer).getUint32(start + 8 + len);
    expect(crc32(out.slice(start + 4, start + 8 + len))).toBe(crc);
    expect(() => addITXt(new Uint8Array([1, 2, 3]), 'x', 'y')).toThrow();
  });
});

describe('proof bundle', () => {
  it('packs logs, round-trips, re-simulates and keeps the fingerprint', async () => {
    const run = botRun();
    const log = run.segments[0].log;
    expect(await unpackLog(await packLog(log))).toEqual(log);
    const salt = 'salt-1';
    const proof = await buildProof(run, { mode: 'hashed', salt, nameHash: nameHash(salt, 'Mia') });
    const back = parseProof(JSON.stringify(proof));
    expect(back.run).toBe(runFingerprint(run.campaign, run.segments));
    expect(back.summary.levels).toBe(2);
    expect(back.summary.stars).toEqual(run.segments.map((s) => s.stars));
    expect(back.summary.wpmP).toBeGreaterThan(0);
    const again = await proofToRun(back);
    const camp = campaignFor(again.campaign.seed);
    for (const seg of again.segments) expect(verifySegment(camp, seg, 'test').ok).toBe(true);
    expect(runFingerprint(again.campaign, again.segments)).toBe(back.run);
    expect(nameMatches(back, ' mia ')).toBe(true);
    expect(nameMatches(back, 'Leo')).toBe(false);
    expect(JSON.stringify(back)).not.toContain('Mia');
    expect(() => parseProof('{"format":"nope"}')).toThrow();
  });
});

describe('tesseract', () => {
  it('has 16 vertices and 32 edges, 4 per vertex; rotations keep lengths; frames are finite', () => {
    expect(VERTICES).toHaveLength(16);
    expect(EDGES).toHaveLength(32);
    for (let v = 0; v < 16; v++) expect(EDGES.filter((e) => e.includes(v))).toHaveLength(4);
    const v = rotate([1, -1, 1, -1], 'xw', 0.7);
    expect(Math.hypot(...v)).toBeCloseTo(2, 10);
    const pts = frame(traitsFrom(new Uint8Array(32).fill(7)), 12345);
    expect(pts.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y) && Math.abs(p.x) < 3 && Math.abs(p.y) < 3)).toBe(true);
  });
});

describe('fingerprint language names', () => {
  it('treats "en" and "lang.en" as the same campaign (profiles vs segments)', () => {
    const run = botRun('lang-names');
    expect(runFingerprint({ language: 'lang.en', seed: 'lang-names' }, run.segments)).toBe(runFingerprint({ language: 'en', seed: 'lang-names' }, run.segments));
  });
});

import { separate } from '@/artifact/tesseract';
describe('glyph spacing', () => {
  it('pushes overlapping glyph discs apart', () => {
    const d = [{ x: 0, y: 0, r: 10 }, { x: 4, y: 0, r: 10 }, { x: 4, y: 0, r: 10 }];
    separate(d);
    for (let i = 0; i < d.length; i++) for (let j = i + 1; j < d.length; j++) expect(Math.hypot(d[i].x - d[j].x, d[i].y - d[j].y)).toBeGreaterThan(15);
  });
});

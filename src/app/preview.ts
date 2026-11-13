/**
 * Dev preview (AGENTS.md): /dev/preview/?template=<id>&letters=fjdk&style=<id>&palette=<id>&seed=1&tier=4[&bot=pass]
 * Plays any template with any letters without touching saves. With bot=<profile> the bot types for you.
 */
import '@/ui/style.css';
import { LevelSim } from '@/sim/level';
import { adHocSetup, language } from '@/campaign/setup';
import { templateSim } from '@/sim/templates';
import { RenderHost } from '@/render/host';
import { palettes, scales, templates } from '@/content/registry';
import { AvatarRig } from '@/avatar/procedural';
import { Hud } from '@/ui/hud';
import { KeyboardInput } from '@/input/keyboard';
import { DEFAULT_SETTINGS } from '@/storage/profile';
import { runBot, type BotProfile } from '../../tools/bot/bot';
import type { LogEvent } from '@/sim/types';

const q = new URLSearchParams(location.search);
const templateId = `template.${(q.get('template') ?? 'pulse-runner').replace(/^template\./, '')}`;
const letters = (q.get('letters') ?? 'fjdk').split('');
const tier = Number(q.get('tier') ?? 4);
const seed = q.get('seed') ?? '1';
const tpl = templates.find((t) => t.id === templateId)!;
const setup = adHocSetup(seed, templateId, letters, { tier });
const sim = new LevelSim(setup, templateSim(templateId));
const canvas = document.getElementById('world') as HTMLCanvasElement;
const ui = document.getElementById('ui')!;
const host = new RenderHost(canvas);
const palette = palettes.find((p) => p.id === `palette.${(q.get('palette') ?? 'dusk').replace(/^palette\./, '')}`) ?? palettes[0];
const styleId = `style.${(q.get('style') ?? 'flat').replace(/^style\./, '')}`;
const scale = scales.find((s) => s.id === `scale.${q.get('scale') ?? 'flowers'}`) ?? scales[0];
host.reducedMotion = q.has('reduced');
host.setLevel({ templateId, view: (q.get('view') as any) ?? tpl.views[0], styleId, palette, havocIds: tpl.supportsHavocs ?? [], havocMaxP: Number(q.get('havoc') ?? 600) }, new AvatarRig(scale, tier), sim, performance.now(), false);
const hud = new Hud(language('en'), { ...DEFAULT_SETTINGS, keyboard: 'auto' });
hud.keyboard.setKnown(letters);
ui.append(hud.el);
const start = performance.now();
let botLog: LogEvent[] | null = null;
let botIdx = 0;
const bot = q.get('bot') as BotProfile | null;
if (bot) botLog = runBot(adHocSetup(seed, templateId, letters, { tier }), templateSim(templateId), { profile: bot, botSeed: seed }).log;
else {
  const input = new KeyboardInput(language('en'));
  input.onPress((k) => {
    const e: LogEvent = { k: 'key', t: Math.round(performance.now() - start), code: k.code };
    sim.feed(e);
    if (e.code === 'KeyF' || e.code === 'KeyJ') hud.flash(true);
  });
}
sim.on((e) => {
  if (e.type === 'correct') hud.flash(true);
  if (e.type === 'error') {
    hud.flash(false);
    hud.markError(e.frame);
  }
});
(window as any).__preview = { sim, host };
function frame(now: number) {
  requestAnimationFrame(frame);
  const t = Math.round(now - start);
  if (botLog) while (botIdx < botLog.length && botLog[botIdx].t <= t && botLog[botIdx].k !== 'end') sim.feed(botLog[botIdx++]);
  if (sim.state.phase !== 'done' && t >= sim.state.simT) sim.advanceTo(t);
  host.render(sim, ((t * 3) / 50) % 1, now);
  hud.update(sim, canvas);
}
requestAnimationFrame(frame);

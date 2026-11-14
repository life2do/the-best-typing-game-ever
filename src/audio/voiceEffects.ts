/**
 * Collectible voice effects (docs/07, M2.8). A voice effect is unlocked by collecting its ability (typing a
 * trigger word such as "voice" quickly); the player then picks it in Settings and it changes the speech
 * voice's pitch and speed. Without a speech voice the effect is still collected and shown by icon and name.
 */
import type { AbilityManifest, VoiceEffectManifest } from '@/content/types';
import { abilities as allAbilities, voiceEffects as allEffects } from '@/content/registry';

export interface VoiceEffectChoice {
  id: string;
  name: string;
  icon: string;
  pitch: number;
  rate: number;
}

export const NORMAL_VOICE: VoiceEffectChoice = { id: '', name: 'Normal', icon: '🙂', pitch: 1, rate: 1 };

const refId = (ref: string) => ref.split('@')[0];

/** The voice effect an ability unlocks, if any. */
export function effectOfAbility(abilityId: string, abilities: AbilityManifest[] = allAbilities, effects: VoiceEffectManifest[] = allEffects): VoiceEffectManifest | undefined {
  const ref = abilities.find((a) => a.id === abilityId)?.voiceEffect;
  return ref ? effects.find((v) => v.id === refId(ref)) : undefined;
}

const choice = (v: VoiceEffectManifest, lang: string): VoiceEffectChoice => ({ id: v.id, name: v.name[lang] ?? v.name.en ?? v.id, icon: v.icon, pitch: v.pitch, rate: v.rate });

/** Effects unlocked by the collected abilities, in content order, named in `lang` ('en', 'ru', ...). */
export function unlockedVoiceEffects(collected: readonly string[], lang = 'en', abilities: AbilityManifest[] = allAbilities, effects: VoiceEffectManifest[] = allEffects): VoiceEffectChoice[] {
  const ids = new Set(collected.map((id) => effectOfAbility(id, abilities, effects)?.id).filter((id): id is string => !!id));
  return effects.filter((v) => ids.has(v.id)).sort((a, b) => (a.id < b.id ? -1 : 1)).map((v) => choice(v, lang));
}

/** The effect to use: the chosen one if it is still unlocked, otherwise the normal voice. */
export function activeVoiceEffect(chosen: string | undefined, collected: readonly string[], lang = 'en', abilities: AbilityManifest[] = allAbilities, effects: VoiceEffectManifest[] = allEffects): VoiceEffectChoice {
  if (!chosen) return NORMAL_VOICE;
  return unlockedVoiceEffects(collected, lang, abilities, effects).find((v) => v.id === chosen) ?? NORMAL_VOICE;
}

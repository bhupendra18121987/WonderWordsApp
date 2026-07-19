// Letter pools + choice-count for the "Letter Hunt" mini-game.
// Uses the existing LANGUAGE_CONFIG alphabets, but limits the pool
// for younger ages so recognition stays achievable.

import type { AgeGroupKey, Language } from '../types';
import { LANGUAGE_CONFIG } from '../languages';

/**
 * Full letter pool the game may pick a target from, per language.
 * Younger kids see only the easiest letters; older kids see everything.
 */
export function letterPool(lang: Language, age: AgeGroupKey): string[] {
  const cfg = LANGUAGE_CONFIG[lang];
  const all = [...cfg.vowels, ...cfg.consonants];
  if (age === '3-4') {
    // ~10 easy-to-say letters
    return lang === 'en'
      ? ['A', 'B', 'C', 'D', 'E', 'M', 'O', 'P', 'S', 'T']
      : ['अ', 'आ', 'क', 'ख', 'ग', 'म', 'न', 'प', 'र', 'स'];
  }
  if (age === '5-6') {
    // First half of the alphabet
    return all.slice(0, Math.min(all.length, 20));
  }
  return all;
}

/** Number of choices (buttons) shown on-screen per age group. */
export const CHOICE_COUNT_BY_AGE: Record<AgeGroupKey, number> = {
  '3-4': 3,
  '5-6': 4,
  '7-8': 6
};

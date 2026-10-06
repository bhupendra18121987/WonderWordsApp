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
  if (age === '2-3') {
    // Rich concrete pool with plenty of variety for toddlers.
    return lang === 'en'
      ? ['A', 'B', 'C', 'D', 'E', 'M', 'O', 'P', 'S', 'T', 'U', 'N']
      : ['अ', 'आ', 'इ', 'ई', 'क', 'ख', 'ग', 'म', 'न', 'प', 'र', 'स'];
  }
  if (age === '3-4') {
    return lang === 'en'
      ? ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'M', 'O', 'P', 'R', 'S', 'T', 'W']
      : ['अ', 'आ', 'इ', 'ई', 'उ', 'क', 'ख', 'ग', 'घ', 'च', 'ज', 'म', 'न', 'प', 'र', 'स'];
  }
  if (age === '5-6') {
    return all.slice(0, Math.min(all.length, 24));
  }
  return all;
}

/** Number of choices (buttons) shown on-screen per age group (at least 6-8). */
export const CHOICE_COUNT_BY_AGE: Record<AgeGroupKey, number> = {
  '2-3': 6,
  '3-4': 6,
  '5-6': 8,
  '7-8': 8
};

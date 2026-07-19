// Curated antonym pairs for the "Antonym Pairs" memory-match mini-game.
// Ordered easiest → hardest within each language. The game picks the
// first N pairs based on age.

import type { AgeGroupKey, Language } from '../types';

export interface AntonymPair {
  id: string;
  labels: Record<Language, [string, string]>;
  /** Optional emoji hints displayed on the card face (small, alongside the word). */
  emoji?: [string, string];
}

/** Ordered by rough difficulty. First pairs are the most concrete. */
export const ANTONYM_PAIRS: AntonymPair[] = [
  { id: 'hot-cold',    emoji: ['🔥','❄️'], labels: { en: ['HOT','COLD'],       hi: ['गरम','ठंडा'] } },
  { id: 'big-small',   emoji: ['🐘','🐜'], labels: { en: ['BIG','SMALL'],      hi: ['बड़ा','छोटा'] } },
  { id: 'day-night',   emoji: ['☀️','🌙'], labels: { en: ['DAY','NIGHT'],      hi: ['दिन','रात'] } },
  { id: 'up-down',     emoji: ['⬆️','⬇️'], labels: { en: ['UP','DOWN'],        hi: ['ऊपर','नीचे'] } },
  { id: 'happy-sad',   emoji: ['😀','😢'], labels: { en: ['HAPPY','SAD'],      hi: ['खुश','उदास'] } },
  { id: 'fast-slow',   emoji: ['🐇','🐢'], labels: { en: ['FAST','SLOW'],      hi: ['तेज़','धीमा'] } },
  { id: 'open-close',  emoji: ['🚪','🔒'], labels: { en: ['OPEN','CLOSED'],    hi: ['खुला','बंद'] } },
  { id: 'wet-dry',     emoji: ['💧','🏜️'], labels: { en: ['WET','DRY'],        hi: ['गीला','सूखा'] } },
  { id: 'clean-dirty', emoji: ['🧼','🐖'], labels: { en: ['CLEAN','DIRTY'],    hi: ['साफ','गंदा'] } },
  { id: 'light-heavy', emoji: ['🪶','🪨'], labels: { en: ['LIGHT','HEAVY'],    hi: ['हल्का','भारी'] } },
  { id: 'full-empty',  emoji: ['🍶','🥛'], labels: { en: ['FULL','EMPTY'],     hi: ['भरा','खाली'] } },
  { id: 'near-far',    emoji: ['📍','🌍'], labels: { en: ['NEAR','FAR'],       hi: ['पास','दूर'] } }
];

/** Number of pairs (so 2× cards) per age group. */
export const PAIR_COUNT_BY_AGE: Record<AgeGroupKey, number> = {
  '3-4': 3,
  '5-6': 4,
  '7-8': 6
};

export function pickPairsForAge(age: AgeGroupKey): AntonymPair[] {
  const n = PAIR_COUNT_BY_AGE[age];
  // Shuffle then slice so consecutive sessions vary; ordering already
  // trends easy → hard so slicing by index also works, but shuffling
  // avoids repetition of the same pairs every play.
  const shuffled = [...ANTONYM_PAIRS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

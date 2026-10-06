// Curated antonym pairs for the "Antonym Pairs" memory-match mini-game.
// Each pair creates two cards, giving 6 to 8 interactive card options per session.
// Shuffled dynamically so kids see a fresh variety of pairs every time.

import type { AgeGroupKey, Language } from '../types';
import { shuffleInPlace } from '../miniGames';

export interface AntonymPair {
  id: string;
  labels: Record<Language, [string, string]>;
  /** Optional emoji hints displayed on the card face (small, alongside the word). */
  emoji?: [string, string];
}

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

/** Number of pairs (giving 2× cards = 6 to 8 options) per age group. */
export const PAIR_COUNT_BY_AGE: Record<AgeGroupKey, number> = {
  '2-3': 3, // 6 card options
  '3-4': 3, // 6 card options
  '5-6': 4, // 8 card options
  '7-8': 4  // 8 card options
};

export function pickPairsForAge(age: AgeGroupKey): AntonymPair[] {
  const n = PAIR_COUNT_BY_AGE[age];
  // Randomize from the full pool so pairs vary every session
  return shuffleInPlace([...ANTONYM_PAIRS]).slice(0, n);
}

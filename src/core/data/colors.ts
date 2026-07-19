// Color palette used by the "Tap the Color" mini-game.
// Kept intentionally small so 3-4 yo can still tell them apart on a
// small phone screen. Age-based subsets pick the first N colors.

import type { AgeGroupKey, Language } from '../types';

export interface ColorEntry {
  id: string;
  /** CSS hex fill for the swatch. */
  hex: string;
  labels: Record<Language, string>;
}

export const COLORS: ColorEntry[] = [
  { id: 'red',    hex: '#ef4b6b', labels: { en: 'red',    hi: 'लाल'   } },
  { id: 'blue',   hex: '#4b8bef', labels: { en: 'blue',   hi: 'नीला'  } },
  { id: 'yellow', hex: '#f6c945', labels: { en: 'yellow', hi: 'पीला'  } },
  { id: 'green',  hex: '#4ec37a', labels: { en: 'green',  hi: 'हरा'   } },
  { id: 'orange', hex: '#f28a3d', labels: { en: 'orange', hi: 'नारंगी'} },
  { id: 'purple', hex: '#9b5de5', labels: { en: 'purple', hi: 'बैंगनी'} },
  { id: 'pink',   hex: '#ff8fab', labels: { en: 'pink',   hi: 'गुलाबी'} },
  { id: 'brown',  hex: '#8b5a2b', labels: { en: 'brown',  hi: 'भूरा'  } }
];

/** Number of on-screen swatches (choices) per age group. */
export const COLOR_COUNT_BY_AGE: Record<AgeGroupKey, number> = {
  '3-4': 4,
  '5-6': 6,
  '7-8': 8
};

export function pickColorsForAge(age: AgeGroupKey): ColorEntry[] {
  const n = COLOR_COUNT_BY_AGE[age];
  return COLORS.slice(0, n);
}

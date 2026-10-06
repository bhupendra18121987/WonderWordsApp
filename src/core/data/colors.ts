// Color palette used by the "Tap the Color" mini-game.
// Shuffled dynamically so kids see a fresh variety of choices every session.

import type { AgeGroupKey, Language } from '../types';
import { shuffleInPlace } from '../miniGames';

export interface ColorEntry {
  id: string;
  /** CSS hex fill for the swatch. */
  hex: string;
  labels: Record<Language, string>;
}

export const COLORS: ColorEntry[] = [
  { id: 'red',      hex: '#ef4b6b', labels: { en: 'red',      hi: 'लाल'   } },
  { id: 'blue',     hex: '#4b8bef', labels: { en: 'blue',     hi: 'नीला'  } },
  { id: 'yellow',   hex: '#f6c945', labels: { en: 'yellow',   hi: 'पीला'  } },
  { id: 'green',    hex: '#4ec37a', labels: { en: 'green',    hi: 'हरा'   } },
  { id: 'orange',   hex: '#f28a3d', labels: { en: 'orange',   hi: 'नारंगी'} },
  { id: 'purple',   hex: '#9b5de5', labels: { en: 'purple',   hi: 'बैंगनी'} },
  { id: 'pink',     hex: '#ff8fab', labels: { en: 'pink',     hi: 'गुलाबी'} },
  { id: 'brown',    hex: '#8b5a2b', labels: { en: 'brown',    hi: 'भूरा'  } },
  { id: 'skyblue',  hex: '#38bdf8', labels: { en: 'sky blue', hi: 'आसमानी'} },
  { id: 'teal',     hex: '#14b8a6', labels: { en: 'teal',     hi: 'फ़िरोज़ी'} },
  { id: 'white',    hex: '#f8fafc', labels: { en: 'white',    hi: 'सफेद'  } },
  { id: 'black',    hex: '#334155', labels: { en: 'black',    hi: 'काला'  } }
];

/** Number of on-screen swatches (choices) per age group (at least 6-8). */
export const COLOR_COUNT_BY_AGE: Record<AgeGroupKey, number> = {
  '2-3': 6,
  '3-4': 6,
  '5-6': 8,
  '7-8': 8
};

export function pickColorsForAge(age: AgeGroupKey): ColorEntry[] {
  const n = COLOR_COUNT_BY_AGE[age];
  // Shuffle all colors so every session presents a varied palette
  return shuffleInPlace([...COLORS]).slice(0, n);
}

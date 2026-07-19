// Character/word pools for the "Trace a Letter" mini-game.
// English is split into CAPITAL, small, and cursive tiers so the child
// can practice each letter shape family. Hindi mode covers both the
// alphabet (independent akshara) and short traceable words.

import type { AgeGroupKey, Language } from '../types';
import { getWordsData } from '../data';
import { LANGUAGE_CONFIG } from '../languages';

export type TraceMode =
  | 'caps'
  | 'small'
  | 'cursive'
  | 'hindiLetters'
  | 'hindiWords';

const EN_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const EN_LOWER = 'abcdefghijklmnopqrstuvwxyz'.split('');

/**
 * The set of characters/words to trace for a given mode.
 * Hindi words are pulled from the age-appropriate wordlist so the
 * child sees familiar vocabulary.
 */
export function tracePool(mode: TraceMode, ageGroup: AgeGroupKey): string[] {
  switch (mode) {
    case 'caps':
      return EN_UPPER;
    case 'small':
      return EN_LOWER;
    case 'cursive':
      return EN_UPPER; // rendered with cursive font family
    case 'hindiLetters': {
      const cfg = LANGUAGE_CONFIG.hi;
      return [...cfg.vowels, ...cfg.consonants];
    }
    case 'hindiWords': {
      const words = getWordsData('hi').words
        .filter((w) => w.ageGroups.includes(ageGroup))
        .map((w) => w.word);
      return words.length > 0 ? words : ['आम', 'नमक', 'बादल'];
    }
  }
}

/**
 * True when the current mode is a Hindi mode — controls the TTS
 * language override so the letter is read in Hindi.
 */
export function traceModeLang(mode: TraceMode): Language {
  return mode === 'hindiLetters' || mode === 'hindiWords' ? 'hi' : 'en';
}

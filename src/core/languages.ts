// Per-language alphabet + fill-pool config. Adding a new language mostly
// means adding an entry to LANGUAGE_CONFIG.

import type { Language } from './types';

export interface LanguageConfig {
  /** BCP-47 language tag for TTS. */
  bcp47: string;
  /** Human-friendly name shown in Settings. */
  displayName: string;
  /** Whether English-style upper-casing should be applied to words. */
  upperCase: boolean;
  /** Pool of graphemes used to fill empty puzzle cells. */
  fillChars: string[];
  /** Vowels for the "Vowels & Consonants" screen. */
  vowels: string[];
  /** Consonants for the "Vowels & Consonants" screen. */
  consonants: string[];
  /** Word for "vowel" spoken aloud when the toggle is on. */
  vowelLabel: string;
  /** Word for "consonant" spoken aloud when the toggle is on. */
  consonantLabel: string;
}

const EN_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const EN_VOWELS = ['A', 'E', 'I', 'O', 'U'];
const EN_CONSONANTS = EN_ALPHABET.filter((l) => !EN_VOWELS.includes(l));

// Common Devanagari letters for random fill. Kept to independent
// consonants + a few independent vowels so cells look tidy alongside the
// placed multi-akshara words.
const HI_FILL = [
  'क','ख','ग','घ','च','छ','ज','झ','ट','ठ','ड','ढ',
  'त','थ','द','ध','न','प','फ','ब','भ','म','य','र',
  'ल','व','श','ष','स','ह',
  'आ','इ','ई','उ','ऊ','ए','ऐ','ओ','औ'
];
const HI_VOWELS = ['अ','आ','इ','ई','उ','ऊ','ऋ','ए','ऐ','ओ','औ'];
const HI_CONSONANTS = [
  'क','ख','ग','घ','ङ',
  'च','छ','ज','झ','ञ',
  'ट','ठ','ड','ढ','ण',
  'त','थ','द','ध','न',
  'प','फ','ब','भ','म',
  'य','र','ल','व',
  'श','ष','स','ह',
  'क्ष','त्र','ज्ञ'
];

export const LANGUAGE_CONFIG: Record<Language, LanguageConfig> = {
  en: {
    bcp47: 'en-US',
    displayName: 'English',
    upperCase: true,
    fillChars: EN_ALPHABET,
    vowels: EN_VOWELS,
    consonants: EN_CONSONANTS,
    vowelLabel: 'vowel',
    consonantLabel: 'consonant'
  },
  hi: {
    bcp47: 'hi-IN',
    displayName: 'हिंदी',
    upperCase: false,
    fillChars: HI_FILL,
    vowels: HI_VOWELS,
    consonants: HI_CONSONANTS,
    vowelLabel: 'स्वर',
    consonantLabel: 'व्यंजन'
  }
};

export function getLanguageConfig(lang: Language): LanguageConfig {
  return LANGUAGE_CONFIG[lang];
}

/** True if the letter is a vowel in the given language. */
export function isVowelForLang(letter: string, lang: Language): boolean {
  if (!letter) return false;
  const cfg = LANGUAGE_CONFIG[lang];
  const l = cfg.upperCase ? letter.toUpperCase() : letter;
  return cfg.vowels.includes(l);
}

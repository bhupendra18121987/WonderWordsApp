// Pure vowel / consonant helpers — shared by web and mobile.
// English elementary rule: A, E, I, O, U are vowels; everything else is a
// consonant. (Y is a "sometimes vowel" but we treat it as a consonant for
// young children.) For other languages the split lives in `languages.ts`.

import { getLanguageConfig, isVowelForLang } from './languages';
import type { Language } from './types';
import { splitGraphemes } from './grapheme';

export type LetterType = 'vowel' | 'consonant';

// Legacy English exports kept for backwards compatibility.
export const ALPHABET: readonly string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const VOWELS: readonly string[] = ['A', 'E', 'I', 'O', 'U'];
export const CONSONANTS: readonly string[] = ALPHABET.filter(
  (l) => !VOWELS.includes(l)
);

/** English-only vowel check. Prefer `isVowelForLang` when language matters. */
export function isVowel(letter: string): boolean {
  return isVowelForLang(letter, 'en');
}

export function getLetterType(letter: string, lang: Language = 'en'): LetterType {
  return isVowelForLang(letter, lang) ? 'vowel' : 'consonant';
}

export function countVowels(word: string, lang: Language = 'en'): number {
  let n = 0;
  for (const g of splitGraphemes(word)) if (isVowelForLang(g, lang)) n++;
  return n;
}

export function countConsonants(word: string, lang: Language = 'en'): number {
  const cfg = getLanguageConfig(lang);
  let n = 0;
  for (const g of splitGraphemes(word)) {
    if (cfg.consonants.includes(g)) n++;
  }
  return n;
}

/** Short child-friendly summary like "5 letters, 2 vowels" (English) or
 *  "3 अक्षर · 1 स्वर" (Hindi). */
export function letterBreakdown(word: string, lang: Language = 'en'): string {
  const graphemes = splitGraphemes(word);
  const total = graphemes.length;
  const vowels = countVowels(word, lang);
  if (lang === 'hi') {
    const aksh = total === 1 ? 'अक्षर' : 'अक्षर';
    const swar = vowels === 1 ? 'स्वर' : 'स्वर';
    return `${total} ${aksh} · ${vowels} ${swar}`;
  }
  const vLabel = vowels === 1 ? 'vowel' : 'vowels';
  const lLabel = total === 1 ? 'letter' : 'letters';
  return `${total} ${lLabel} · ${vowels} ${vLabel}`;
}

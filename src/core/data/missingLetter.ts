// Puzzle generator for the "Missing Letter" mini-game.
// Uses the existing words data (age-tagged) and the language's alphabet
// (vowels + consonants) as the distractor pool.

import type { AgeGroupKey, Language, WordEntry } from '../types';
import { getWordsData } from '../data';
import { LANGUAGE_CONFIG } from '../languages';
import { splitGraphemes } from '../grapheme';
import { buildChoices, pickOne } from '../miniGames';

export interface MissingLetterPuzzle {
  word: WordEntry;
  /** The graphemes making up the word (Devanagari-aware). */
  graphemes: string[];
  /** Which grapheme index is hidden. */
  blankIndex: number;
  /** The grapheme that goes in the blank. */
  answer: string;
  /** Answer + distractors, already shuffled. */
  choices: string[];
}

/**
 * Try to build a puzzle from the age's word pool. Falls back to a broader
 * search if the strict criteria (blankable grapheme found in alphabet)
 * cannot be met.
 */
export function generateMissingLetter(
  lang: Language,
  age: AgeGroupKey,
  choiceCount: number
): MissingLetterPuzzle | null {
  const cfg = LANGUAGE_CONFIG[lang];
  const alphabet = [...cfg.vowels, ...cfg.consonants];
  const allWords = getWordsData(lang).words.filter((w) =>
    w.ageGroups.includes(age)
  );
  if (allWords.length === 0) return null;

  // Try up to N random words; each must have at least one grapheme that is
  // a member of the alphabet (so distractors and answer share the same pool).
  const shuffledWords = [...allWords].sort(() => Math.random() - 0.5);
  for (const word of shuffledWords.slice(0, 20)) {
    const graphemes = splitGraphemes(word.word);
    if (graphemes.length < 2) continue;

    // Positions whose grapheme is present in the alphabet.
    const candidates: number[] = [];
    for (let i = 0; i < graphemes.length; i++) {
      const g = graphemes[i]!;
      if (alphabet.includes(g)) candidates.push(i);
    }
    if (candidates.length === 0) continue;

    const blankIndex = pickOne(candidates) ?? candidates[0]!;
    const answer = graphemes[blankIndex]!;
    const choices = buildChoices(answer, alphabet, choiceCount);
    return { word, graphemes, blankIndex, answer, choices };
  }
  return null;
}

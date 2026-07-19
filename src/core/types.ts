// Shared, platform-agnostic types. Consumed by both the web app and the future
// React Native mobile app — do NOT reference any DOM / browser APIs here.

export type AgeGroupKey = '3-4' | '5-6' | '7-8';

export type Language = 'en' | 'hi';

export type Direction =
  | 'horizontal'
  | 'reverseHorizontal'
  | 'vertical'
  | 'reverseVertical'
  | 'diagonal'
  | 'reverseDiagonal'
  | 'antiDiagonal'
  | 'reverseAntiDiagonal';

export interface AgeGroupConfig {
  label: string;
  emoji: string;
  gridSize: number;
  wordsPerPuzzle: number;
  minLength: number;
  maxLength: number;
  directions: Direction[];
  themeColor: string;
}

export interface WordEntry {
  word: string;
  category: string;
  ageGroups: AgeGroupKey[];
  emoji: string;
  meaning: string;
}

export interface LearnedWord {
  word: string;
  emoji: string;
  meaning: string;
  category: string;
}

export interface Badge {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

export interface RewardsData {
  praise: string[];
  encouragement: string[];
  badges: Badge[];
}

export interface WordsData {
  ageGroups: Record<AgeGroupKey, AgeGroupConfig>;
  words: WordEntry[];
}

export interface Cell {
  r: number;
  c: number;
}

export interface Placement {
  word: string;
  cells: Cell[];
  direction: Direction;
}

export interface Puzzle {
  grid: string[][];
  size: number;
  placements: Placement[];
  words: string[];
  items: WordEntry[];
}

export interface Settings {
  sound: boolean;
  music: boolean;
  letterSpeech: boolean;
  highContrast: boolean;
  /** Speak "vowel" / "consonant" after each letter is pronounced. */
  announceLetterType: boolean;
  /** Give vowel cells a subtle color tint in the puzzle grid. */
  highlightVowels: boolean;
  /** Active game / UI language. */
  language: Language;
}

export interface Progress {
  level: number;
  stars: number;
  puzzlesCompleted: number;
  learnedWords: LearnedWord[];
  badges: string[];
  lastPlayedLevel: number;
}

export interface FoundWord {
  word: string;
  cells: Cell[];
  meta?: WordEntry;
}

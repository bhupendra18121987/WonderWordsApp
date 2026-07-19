// Pure game-logic helpers — reused by web and mobile UIs.
import { getRewardsData, rewardsData } from './data';
import type { Language, LearnedWord, Progress, WordEntry } from './types';

export function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

// Backwards-compatible English defaults.
export const pickPraise = (lang: Language = 'en'): string =>
  pickRandom(getRewardsData(lang).praise);
export const pickEncouragement = (lang: Language = 'en'): string =>
  pickRandom(getRewardsData(lang).encouragement);

// Keep the old zero-arg exports referenced elsewhere by re-exporting a no-op:
export const legacyPraise = (): string => pickRandom(rewardsData.praise);
export const legacyEncouragement = (): string =>
  pickRandom(rewardsData.encouragement);

/** Award 1–3 stars based on how many mistakes and hints were used. */
export function computeStars(mistakes: number, hintsUsed: number): 1 | 2 | 3 {
  const penalty = mistakes + hintsUsed;
  if (penalty >= 5) return 1;
  if (penalty >= 2) return 2;
  return 3;
}

/** Star rating from a mini-game score/total. */
export function starsFromScore(score: number, total: number): 1 | 2 | 3 {
  if (total <= 0) return 1;
  const pct = score / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.6) return 2;
  return 1;
}

/** Immutably add a newly-found word to the learned list if it isn't there yet. */
export function mergeLearnedWord(
  learned: LearnedWord[],
  entry: WordEntry
): LearnedWord[] {
  if (learned.some((w) => w.word === entry.word)) return learned;
  return [
    ...learned,
    {
      word: entry.word,
      emoji: entry.emoji,
      meaning: entry.meaning,
      category: entry.category
    }
  ];
}

export interface BadgeContext {
  totalWords: number;
  totalPuzzles: number;
  currentStreak: number;
}

/** Return the full set of earned badge ids given progress + streak. */
export function computeBadges(
  currentBadges: readonly string[],
  ctx: BadgeContext
): string[] {
  const set = new Set(currentBadges);
  if (ctx.totalWords >= 1) set.add('first_word');
  if (ctx.totalWords >= 10) set.add('words_10');
  if (ctx.totalWords >= 25) set.add('words_25');
  if (ctx.totalPuzzles >= 1) set.add('puzzle_1');
  if (ctx.totalPuzzles >= 5) set.add('puzzle_5');
  if (ctx.currentStreak >= 3) set.add('streak_3');
  return Array.from(set);
}

/**
 * Given the current progress and the outcome of a finished puzzle, return the
 * next progress state. Pure — no side effects.
 */
export function progressAfterPuzzle(params: {
  current: Progress;
  level: number;
  stars: 1 | 2 | 3;
  foundWords: WordEntry[];
  currentStreak: number;
}): Progress {
  const { current, level, stars, foundWords, currentStreak } = params;
  let learnedWords = current.learnedWords;
  for (const w of foundWords) learnedWords = mergeLearnedWord(learnedWords, w);
  const puzzlesCompleted = current.puzzlesCompleted + 1;
  const nextStars = current.stars + stars;
  const badges = computeBadges(current.badges, {
    totalWords: learnedWords.length,
    totalPuzzles: puzzlesCompleted,
    currentStreak
  });
  return {
    level: Math.max(current.level, level + 1),
    stars: nextStars,
    puzzlesCompleted,
    learnedWords,
    badges,
    lastPlayedLevel: level
  };
}

/**
 * Returns a new Progress with the score counters reset (stars, puzzles
 * completed, level) while keeping the child's learned words and earned
 * badges intact. Useful for correcting inflated scores without wiping
 * vocabulary progress.
 */
export function resetScoresOnly(current: Progress): Progress {
  return {
    ...current,
    stars: 0,
    puzzlesCompleted: 0,
    level: 1,
    lastPlayedLevel: 0
  };
}

/**
 * Returns a new Progress that restarts the level counter at 1 while
 * preserving stars, learned words, badges, and the puzzles-completed count.
 * Perfect for a child who wants to replay from the beginning without
 * losing what they've earned.
 */
export function restartAtLevelOne(current: Progress): Progress {
  return { ...current, level: 1, lastPlayedLevel: 0 };
}

/**
 * Silently correct impossibly-inflated stored progress values. Since each
 * puzzle can award at most 3 stars, any `stars` count greater than
 * `puzzlesCompleted * 3` must be from a bug — cap it. Also caps
 * `puzzlesCompleted` at a reasonable multiple of learned words so a runaway
 * counter can't leak through either.
 */
export function sanitizeProgress(p: Progress): Progress {
  const maxPuzzles = Math.max(p.learnedWords.length, 1) * 4; // very generous
  const puzzlesCompleted = Math.min(p.puzzlesCompleted, maxPuzzles);
  const maxStars = Math.max(puzzlesCompleted, 1) * 3;
  const stars = Math.min(p.stars, maxStars);
  const level = Math.max(1, Math.min(p.level, puzzlesCompleted + 1));
  if (
    stars === p.stars &&
    puzzlesCompleted === p.puzzlesCompleted &&
    level === p.level
  ) {
    return p;
  }
  return { ...p, stars, puzzlesCompleted, level };
}

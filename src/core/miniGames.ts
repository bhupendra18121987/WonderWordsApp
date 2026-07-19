// Shared helpers for the "pick the correct answer" mini-games
// (Letter Hunt, Tap the Color). Pure functions, no React.

/** Fisher–Yates in-place shuffle, returns the same array for chaining. */
export function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

/** Pick one random element from `arr`. Undefined if arr is empty. */
export function pickOne<T>(arr: readonly T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Build a set of `count` choices for a multiple-choice question:
 * always includes `target`, plus `count-1` random distractors from
 * `pool` (never repeating). The final ordering is shuffled.
 */
export function buildChoices<T>(target: T, pool: readonly T[], count: number): T[] {
  const distractors = pool.filter((x) => x !== target);
  shuffleInPlace(distractors as T[]);
  const chosen = distractors.slice(0, Math.max(0, count - 1));
  chosen.push(target);
  return shuffleInPlace(chosen);
}

/** Number of rounds in a single mini-game session. */
export const ROUNDS_PER_SESSION = 8;

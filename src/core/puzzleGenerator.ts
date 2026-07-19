// Pure word-search puzzle generator. No DOM, no React — safe to use from
// React Native as well. Grapheme-aware so it works for both Latin scripts
// (English) and syllabic scripts (Hindi / Devanagari).
import type { Cell, Direction, Placement, Puzzle, WordEntry, AgeGroupKey } from './types';
import { splitGraphemes } from './grapheme';

const DEFAULT_FILL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const DIRECTION_VECTORS: Record<Direction, { dr: number; dc: number }> = {
  horizontal:          { dr: 0,  dc: 1 },
  reverseHorizontal:   { dr: 0,  dc: -1 },
  vertical:            { dr: 1,  dc: 0 },
  reverseVertical:     { dr: -1, dc: 0 },
  diagonal:            { dr: 1,  dc: 1 },
  reverseDiagonal:     { dr: -1, dc: -1 },
  antiDiagonal:        { dr: 1,  dc: -1 },
  reverseAntiDiagonal: { dr: -1, dc: 1 }
};

function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function canPlace(
  grid: string[][],
  graphemes: string[],
  row: number,
  col: number,
  dr: number,
  dc: number
): boolean {
  const size = grid.length;
  for (let i = 0; i < graphemes.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    if (r < 0 || r >= size || c < 0 || c >= size) return false;
    const existing = grid[r]![c];
    if (existing && existing !== graphemes[i]) return false;
  }
  return true;
}

function place(
  grid: string[][],
  graphemes: string[],
  row: number,
  col: number,
  dr: number,
  dc: number
): Cell[] {
  const cells: Cell[] = [];
  for (let i = 0; i < graphemes.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    grid[r]![c] = graphemes[i]!;
    cells.push({ r, c });
  }
  return cells;
}

/**
 * Build a filled grid containing the requested words placed in one of the
 * allowed directions. Words that cannot be fit are simply skipped.
 * @param fillChars pool of graphemes used to fill empty cells (defaults to A-Z)
 */
export function generatePuzzle(
  words: string[],
  size: number,
  allowedDirections: Direction[],
  fillChars: string[] = DEFAULT_FILL
): Omit<Puzzle, 'items'> {
  const grid: string[][] = Array.from({ length: size }, () =>
    Array<string>(size).fill('')
  );
  const placements: Placement[] = [];
  const placedWords: string[] = [];
  // Sort by grapheme length (longest first) for higher placement success.
  const sorted = words
    .slice()
    .sort((a, b) => splitGraphemes(b).length - splitGraphemes(a).length);

  for (const rawWord of sorted) {
    const graphemes = splitGraphemes(rawWord);
    if (graphemes.length === 0 || graphemes.length > size) continue;

    const dirs = shuffle(allowedDirections);
    let placed = false;
    outer: for (const dirName of dirs) {
      const { dr, dc } = DIRECTION_VECTORS[dirName];
      const positions: Cell[] = [];
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          positions.push({ r, c });
        }
      }
      for (const { r, c } of shuffle(positions)) {
        if (canPlace(grid, graphemes, r, c, dr, dc)) {
          const cells = place(grid, graphemes, r, c, dr, dc);
          placements.push({ word: rawWord, cells, direction: dirName });
          placedWords.push(rawWord);
          placed = true;
          break outer;
        }
      }
    }
    if (!placed) {
      // silently skipped — will not appear in the word list
    }
  }

  // Fill empty cells with random graphemes from the language's pool.
  const pool = fillChars.length > 0 ? fillChars : DEFAULT_FILL;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r]![c]) grid[r]![c] = pool[randomInt(pool.length)]!;
    }
  }

  return { grid, size, placements, words: placedWords };
}

/**
 * Given the sequence of cells the player dragged over, return the word spelled
 * and whether the selection is a straight line (any of the eight directions).
 */
export function readSelection(
  grid: string[][],
  cells: Cell[]
): { word: string; isStraight: boolean } {
  if (!cells || cells.length === 0) return { word: '', isStraight: false };
  const first = cells[0]!;
  if (cells.length === 1) {
    return { word: grid[first.r]![first.c]!, isStraight: true };
  }
  const last = cells[cells.length - 1]!;
  const dr = Math.sign(last.r - first.r);
  const dc = Math.sign(last.c - first.c);
  for (let i = 0; i < cells.length; i++) {
    const expectedR = first.r + dr * i;
    const expectedC = first.c + dc * i;
    const c = cells[i]!;
    if (c.r !== expectedR || c.c !== expectedC) {
      return { word: '', isStraight: false };
    }
  }
  const word = cells.map((c) => grid[c.r]![c.c]).join('');
  return { word, isStraight: true };
}

/**
 * Compute all cells on the straight line between `start` and `end`, or null
 * if the two points don't lie on a horizontal / vertical / diagonal line.
 */
export function lineBetween(start: Cell, end: Cell): Cell[] | null {
  if (!start || !end) return null;
  const rowDiff = end.r - start.r;
  const colDiff = end.c - start.c;
  const absR = Math.abs(rowDiff);
  const absC = Math.abs(colDiff);
  const isStraight = rowDiff === 0 || colDiff === 0 || absR === absC;
  if (!isStraight) return null;
  const steps = Math.max(absR, absC);
  const dr = steps === 0 ? 0 : rowDiff / steps;
  const dc = steps === 0 ? 0 : colDiff / steps;
  const cells: Cell[] = [];
  for (let i = 0; i <= steps; i++) {
    cells.push({ r: start.r + dr * i, c: start.c + dc * i });
  }
  return cells;
}

export interface SelectWordsOptions {
  bank: WordEntry[];
  ageGroup: AgeGroupKey;
  count: number;
  minLength: number;
  maxLength: number;
  excludeWords?: string[];
}

/**
 * Pick a variety of age-appropriate words, preferring ones the child hasn't
 * seen yet. Falls back to any age-group word once the fresh pool is exhausted.
 */
export function selectWordsForLevel({
  bank,
  ageGroup,
  count,
  minLength,
  maxLength,
  excludeWords = []
}: SelectWordsOptions): WordEntry[] {
  const excluded = new Set(excludeWords);
  const filtered = bank.filter((entry) => {
    const len = splitGraphemes(entry.word).length;
    return (
      entry.ageGroups.includes(ageGroup) &&
      len >= minLength &&
      len <= maxLength &&
      !excluded.has(entry.word)
    );
  });
  if (filtered.length === 0) {
    return shuffle(bank.filter((e) => e.ageGroups.includes(ageGroup))).slice(0, count);
  }

  const buckets = new Map<string, WordEntry[]>();
  for (const entry of shuffle(filtered)) {
    if (!buckets.has(entry.category)) buckets.set(entry.category, []);
    buckets.get(entry.category)!.push(entry);
  }
  const result: WordEntry[] = [];
  const categories = shuffle(Array.from(buckets.keys()));
  let i = 0;
  while (result.length < count && buckets.size > 0) {
    const cat = categories[i % categories.length]!;
    const list = buckets.get(cat);
    if (list && list.length > 0) {
      result.push(list.shift()!);
      if (list.length === 0) buckets.delete(cat);
    }
    i++;
    if (i > 1000) break;
  }
  return result.slice(0, count);
}

/**
 * High-level helper: pick the right words for a puzzle, size the grid, and
 * generate the placements. Returns everything the UI needs to render.
 */
export function buildPuzzleForLevel(params: {
  bank: WordEntry[];
  ageGroup: AgeGroupKey;
  gridSize: number;
  wordsPerPuzzle: number;
  minLength: number;
  maxLength: number;
  directions: Direction[];
  excludeWords?: string[];
  fillChars?: string[];
}): Puzzle {
  const chosen = selectWordsForLevel({
    bank: params.bank,
    ageGroup: params.ageGroup,
    count: params.wordsPerPuzzle,
    minLength: params.minLength,
    maxLength: params.maxLength,
    excludeWords: params.excludeWords
  });
  const gen = generatePuzzle(
    chosen.map((c) => c.word),
    params.gridSize,
    params.directions,
    params.fillChars
  );
  const placedSet = new Set(gen.placements.map((p) => p.word));
  const items = chosen.filter((c) => placedSet.has(c.word));
  return { ...gen, items };
}

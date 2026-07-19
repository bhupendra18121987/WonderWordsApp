// Pure tic-tac-toe game logic. No DOM, no React — shared with the future
// mobile app. Uses a fixed 3×3 board so we can hard-code the 8 win lines.

/** 0 = empty, 1 = human player, -1 = the mascot (AI). */
export type TttCell = 0 | 1 | -1;
export type Board = readonly TttCell[];
export type Difficulty = 'easy' | 'medium' | 'hard';

export const WIN_LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],   // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8],   // columns
  [0, 4, 8], [2, 4, 6]               // diagonals
];

export function emptyBoard(): TttCell[] {
  return Array<TttCell>(9).fill(0);
}

export interface WinInfo {
  winner: 1 | -1;
  line: readonly [number, number, number];
}

export function findWinner(board: Board): WinInfo | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const v = board[a];
    if (v !== 0 && v === board[b] && v === board[c]) {
      return { winner: v as 1 | -1, line };
    }
  }
  return null;
}

export function isDraw(board: Board): boolean {
  return !findWinner(board) && board.every((c) => c !== 0);
}

export function availableMoves(board: Board): number[] {
  const out: number[] = [];
  for (let i = 0; i < 9; i++) if (board[i] === 0) out.push(i);
  return out;
}

function randomOf<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

/** Return an index that would let `who` win on their next move, or null. */
function findWinningMove(board: Board, who: 1 | -1): number | null {
  for (const move of availableMoves(board)) {
    const next = board.slice() as TttCell[];
    next[move] = who;
    if (findWinner(next)?.winner === who) return move;
  }
  return null;
}

/**
 * Minimax score for the AI (side = -1). Positive means the AI wins,
 * negative means the human wins. The depth penalty prefers faster
 * wins / slower losses so the AI feels decisive.
 */
function minimaxScore(board: Board, isMaximizing: boolean, depth: number): number {
  const w = findWinner(board);
  if (w?.winner === -1) return 10 - depth;
  if (w?.winner === 1)  return depth - 10;
  if (availableMoves(board).length === 0) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (const move of availableMoves(board)) {
      const next = board.slice() as TttCell[];
      next[move] = -1;
      best = Math.max(best, minimaxScore(next, false, depth + 1));
    }
    return best;
  } else {
    let best = Infinity;
    for (const move of availableMoves(board)) {
      const next = board.slice() as TttCell[];
      next[move] = 1;
      best = Math.min(best, minimaxScore(next, true, depth + 1));
    }
    return best;
  }
}

function bestMove(board: Board): number {
  let bestScore = -Infinity;
  let bestMoves: number[] = [];
  for (const move of availableMoves(board)) {
    const next = board.slice() as TttCell[];
    next[move] = -1;
    const score = minimaxScore(next, false, 0);
    if (score > bestScore) {
      bestScore = score;
      bestMoves = [move];
    } else if (score === bestScore) {
      bestMoves.push(move);
    }
  }
  return randomOf(bestMoves);
}

/**
 * Pick a move for the AI based on difficulty.
 * - easy   → random (kid usually wins) — good for 3–4 year olds
 * - medium → take win, else block, else prefer centre/corners — good for 5–6
 * - hard   → full minimax (perfect play, kid can only draw) — for 7–8
 */
export function aiMove(board: Board, difficulty: Difficulty): number {
  const moves = availableMoves(board);
  if (moves.length === 0) return -1;

  if (difficulty === 'easy') return randomOf(moves);

  if (difficulty === 'medium') {
    const win = findWinningMove(board, -1);
    if (win !== null) return win;
    const block = findWinningMove(board, 1);
    if (block !== null) return block;
    if (board[4] === 0) return 4;
    const corners = [0, 2, 6, 8].filter((i) => board[i] === 0);
    if (corners.length > 0) return randomOf(corners);
    return randomOf(moves);
  }

  return bestMove(board);
}

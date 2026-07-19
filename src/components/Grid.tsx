import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  PanResponderInstance,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { lineBetween, readSelection } from '../core/puzzleGenerator';
import { isVowelForLang } from '../core/languages';
import type { Cell, Language } from '../core/types';

interface GridProps {
  grid: string[][];
  foundCells?: Cell[];
  /** Optional per-word coloring for found cells (matches WordList chip color). */
  foundGroups?: { cells: Cell[]; color: { bg: string; dark: string } }[];
  hintCells?: Cell[];
  wrongCells?: Cell[];
  highlightVowels?: boolean;
  language?: Language;
  onLetterEnter?: (letter: string) => void;
  onSelectionAttempt?: (result: { word: string; cells: Cell[]; isStraight: boolean }) => void;
  /** Overall grid pixel width (the whole square). We derive cell size from this. */
  gridWidth: number;
}

const CELL_GAP = 4;
const GRID_PADDING = 8;

/**
 * Drag-select word-search grid for React Native.
 *
 * PanResponder tracks the finger over the grid. On each move we convert
 * page coordinates back to (row, col) using the grid's measured screen
 * position + our known cell size + gap layout. When the finger lifts we
 * compute the straight line between start & current, read the letters in
 * that order, and hand the whole selection to `onSelectionAttempt`.
 */
export default function Grid({
  grid,
  foundCells = [],
  foundGroups,
  hintCells = [],
  wrongCells = [],
  highlightVowels = false,
  language = 'en',
  onLetterEnter,
  onSelectionAttempt,
  gridWidth
}: GridProps) {
  const size = grid.length;
  // (gridWidth - 2*padding - (size-1)*gap) / size
  const cellSize = Math.max(
    24,
    Math.floor(
      (gridWidth - 2 * GRID_PADDING - (size - 1) * CELL_GAP) / size
    )
  );

  const gridViewRef = useRef<View | null>(null);
  const gridPageRef = useRef<{ x: number; y: number } | null>(null);
  // We mirror mutable puzzle info into refs so the PanResponder callbacks
  // (created once) always see fresh values.
  const gridRef = useRef(grid);
  const cellSizeRef = useRef(cellSize);
  const sizeRef = useRef(size);
  useEffect(() => { gridRef.current = grid; sizeRef.current = grid.length; }, [grid]);
  useEffect(() => { cellSizeRef.current = cellSize; }, [cellSize]);

  const startRef = useRef<Cell | null>(null);
  const currentRef = useRef<Cell | null>(null);
  const lastKeyRef = useRef<string | null>(null);

  const [start, setStart] = useState<Cell | null>(null);
  const [current, setCurrent] = useState<Cell | null>(null);
  const [selecting, setSelecting] = useState(false);

  const measureGrid = useCallback(() => {
    gridViewRef.current?.measureInWindow((x, y) => {
      gridPageRef.current = { x, y };
    });
  }, []);

  const cellFromPage = useCallback((pageX: number, pageY: number): Cell | null => {
    const bounds = gridPageRef.current;
    if (!bounds) return null;
    const cs = cellSizeRef.current;
    const localX = pageX - bounds.x - GRID_PADDING;
    const localY = pageY - bounds.y - GRID_PADDING;
    if (localX < 0 || localY < 0) return null;
    const step = cs + CELL_GAP;
    const c = Math.floor(localX / step);
    const r = Math.floor(localY / step);
    // Ignore the finger being in the gap between cells (unless it's touching
    // the padding at the edges of a cell — being generous with hitboxes).
    const withinC = localX - c * step;
    const withinR = localY - r * step;
    if (withinC > cs + CELL_GAP / 2 || withinR > cs + CELL_GAP / 2) return null;
    if (r < 0 || r >= sizeRef.current || c < 0 || c >= sizeRef.current) return null;
    return { r, c };
  }, []);

  const beginAt = useCallback((cell: Cell) => {
    startRef.current = cell;
    currentRef.current = cell;
    lastKeyRef.current = `${cell.r},${cell.c}`;
    setStart(cell);
    setCurrent(cell);
    setSelecting(true);
    onLetterEnter?.(gridRef.current[cell.r]![cell.c]!);
  }, [onLetterEnter]);

  const updateTo = useCallback((cell: Cell) => {
    const key = `${cell.r},${cell.c}`;
    if (lastKeyRef.current === key) return;
    lastKeyRef.current = key;
    currentRef.current = cell;
    setCurrent(cell);
    onLetterEnter?.(gridRef.current[cell.r]![cell.c]!);
  }, [onLetterEnter]);

  const finish = useCallback(() => {
    const s = startRef.current;
    const c = currentRef.current;
    if (s) {
      const cells = lineBetween(s, c || s) || [s];
      const { word, isStraight } = readSelection(gridRef.current, cells);
      onSelectionAttempt?.({ word, cells, isStraight });
    }
    startRef.current = null;
    currentRef.current = null;
    lastKeyRef.current = null;
    setStart(null);
    setCurrent(null);
    setSelecting(false);
  }, [onSelectionAttempt]);

  const panResponder = useMemo<PanResponderInstance>(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderGrant: (e) => {
          const cell = cellFromPage(e.nativeEvent.pageX, e.nativeEvent.pageY);
          if (cell) beginAt(cell);
        },
        onPanResponderMove: (e) => {
          const cell = cellFromPage(e.nativeEvent.pageX, e.nativeEvent.pageY);
          if (cell) updateTo(cell);
        },
        onPanResponderRelease: () => finish(),
        onPanResponderTerminate: () => finish()
      }),
    [cellFromPage, beginAt, updateTo, finish]
  );

  // --- Derived state for highlighting ---
  const activeLine: Cell[] = useMemo(() => {
    if (!selecting || !start) return [];
    return lineBetween(start, current || start) || [start];
  }, [selecting, start, current]);

  const activeSet = useMemo(() => new Set(activeLine.map((c) => `${c.r},${c.c}`)), [activeLine]);
  const foundSet = useMemo(() => new Set(foundCells.map((c) => `${c.r},${c.c}`)), [foundCells]);
  const hintSet = useMemo(() => new Set(hintCells.map((c) => `${c.r},${c.c}`)), [hintCells]);
  const wrongSet = useMemo(() => new Set(wrongCells.map((c) => `${c.r},${c.c}`)), [wrongCells]);
  const cellColor = useMemo(() => {
    const map = new Map<string, { bg: string; dark: string }>();
    if (foundGroups) {
      for (const g of foundGroups) {
        for (const c of g.cells) map.set(`${c.r},${c.c}`, g.color);
      }
    }
    return map;
  }, [foundGroups]);

  // Wrong-cell shake animation
  const shakeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (wrongCells.length === 0) return;
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true, easing: Easing.linear }),
      Animated.timing(shakeAnim, { toValue:  6, duration: 60, useNativeDriver: true, easing: Easing.linear }),
      Animated.timing(shakeAnim, { toValue: -4, duration: 60, useNativeDriver: true, easing: Easing.linear }),
      Animated.timing(shakeAnim, { toValue:  0, duration: 60, useNativeDriver: true, easing: Easing.linear })
    ]).start();
  }, [wrongCells, shakeAnim]);

  return (
    <View
      ref={gridViewRef}
      onLayout={measureGrid}
      style={[styles.grid, { width: gridWidth, height: gridWidth }]}
      {...panResponder.panHandlers}
    >
      {grid.map((row, r) => (
        <View key={r} style={styles.gridRow}>
          {row.map((letter, c) => {
            const key = `${r},${c}`;
            const isActive = activeSet.has(key);
            const isFound = foundSet.has(key);
            const isHint = hintSet.has(key);
            const isWrong = wrongSet.has(key);
            const vowel = highlightVowels && isVowelForLang(letter, language);
            const groupColor = isFound ? cellColor.get(key) : undefined;
            const style = [
              styles.cell,
              { width: cellSize, height: cellSize },
              vowel && styles.cellVowel,
              isActive && styles.cellActive,
              isHint && !isFound && styles.cellHint,
              isFound && styles.cellFound,
              isFound && groupColor && { backgroundColor: groupColor.bg, borderWidth: 2, borderColor: groupColor.dark },
              isWrong && styles.cellWrong
            ];
            const inner = (
              <Text
                style={[
                  styles.cellText,
                  isActive && styles.cellTextActive,
                  isFound && styles.cellTextFound,
                  isWrong && styles.cellTextFound
                ]}
              >
                {letter}
              </Text>
            );
            if (isWrong) {
              return (
                <Animated.View
                  key={key}
                  style={[style, { transform: [{ translateX: shakeAnim }] }]}
                >
                  {inner}
                </Animated.View>
              );
            }
            return (
              <View key={key} style={style}>
                {inner}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    padding: GRID_PADDING,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4
  },
  gridRow: {
    flexDirection: 'row',
    gap: CELL_GAP,
    marginBottom: CELL_GAP
  },
  cell: {
    backgroundColor: '#fef1d6',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cellVowel: {
    backgroundColor: '#ffd8e4'
  },
  cellActive: {
    backgroundColor: '#ffcf5c',
    transform: [{ scale: 1.05 }]
  },
  cellFound: {
    backgroundColor: '#58c896'
  },
  cellWrong: {
    backgroundColor: '#ff6b6b'
  },
  cellHint: {
    backgroundColor: '#d19cff'
  },
  cellText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e1b4b'
  },
  cellTextActive: {
    color: '#1e1b4b'
  },
  cellTextFound: {
    color: '#fff'
  }
});

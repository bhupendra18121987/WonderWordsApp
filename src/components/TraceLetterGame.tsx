import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type NativeSyntheticEvent,
  type NativeTouchEvent,
  type LayoutChangeEvent,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { AgeGroupKey, Language } from '../core/types';
import { t } from '../core/i18n';
import { graphemeLength } from '../core/grapheme';
import { traceModeLang, tracePool, type TraceMode } from '../core/data/tracePool';
import MiniConfetti from './MiniConfetti';
import ThemedScreen from './ThemedScreen';

interface TraceLetterGameProps {
  ageGroup: AgeGroupKey;
  language: Language;
  onExit: () => void;
  /** Speaks a character/word in the given TTS language. */
  speakText: (text: string, lang?: string) => void;
}

interface Point { x: number; y: number }

const MODES: { id: TraceMode; labelKey: 'traceModeCaps' | 'traceModeSmall' | 'traceModeCursive' | 'traceModeHiLetters' | 'traceModeHiWords' }[] = [
  { id: 'caps',         labelKey: 'traceModeCaps' },
  { id: 'small',        labelKey: 'traceModeSmall' },
  { id: 'cursive',      labelKey: 'traceModeCursive' },
  { id: 'hindiLetters', labelKey: 'traceModeHiLetters' },
  { id: 'hindiWords',   labelKey: 'traceModeHiWords' }
];

function pointsToPath(pts: Point[]): string {
  if (pts.length === 0) return '';
  const [head, ...rest] = pts;
  let d = `M${head!.x.toFixed(1)} ${head!.y.toFixed(1)}`;
  for (const p of rest) d += ` L${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  return d;
}

/**
 * Free-hand tracing mini-game. The current character/word is shown
 * behind the drawing surface as a faded template; the child drags
 * their finger to trace over it. A lightweight coverage check makes sure
 * the child has traced a meaningful portion of the shown glyph before
 * unlocking the next item.
 */
export default function TraceLetterGame({
  ageGroup,
  language,
  onExit,
  speakText
}: TraceLetterGameProps) {
  const strings = t(language);
  const { width: windowWidth } = useWindowDimensions();
  const [mode, setMode] = useState<TraceMode>('caps');
  const [index, setIndex] = useState(0);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [completed, setCompleted] = useState<number[]>([]);
  const [checkMessage, setCheckMessage] = useState('');
  const [burstCount, setBurstCount] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [glyphBounds, setGlyphBounds] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [activeStroke, setActiveStroke] = useState<Point[]>([]);
  const activeStrokeRef = useRef<Point[]>([]);
  const nextTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (nextTimerRef.current) clearTimeout(nextTimerRef.current);
    };
  }, []);

  const pool = useMemo(() => tracePool(mode, ageGroup), [mode, ageGroup]);
  const current = pool[index] ?? '';

  // Reset when mode changes.
  const changeMode = (m: TraceMode) => {
    if (nextTimerRef.current) {
      clearTimeout(nextTimerRef.current);
      nextTimerRef.current = null;
    }
    setMode(m);
    setIndex(0);
    setStrokes([]);
    setCompleted([]);
    setCheckMessage('');
    activeStrokeRef.current = [];
    setActiveStroke([]);
  };

  const clear = () => {
    setStrokes([]);
    activeStrokeRef.current = [];
    setActiveStroke([]);
    setCheckMessage('');
  };

  const checkTrace = () => {
    if (completed.includes(index)) return;
    const { width, height } = canvasSize;
    if (!width || !height || !glyphBounds.width || !glyphBounds.height) return;
    let length = 0;
    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;
    const occupied = new Set<string>();
    let pointCount = 0;
    const toleranceX = glyphBounds.width * 0.12;
    const toleranceY = glyphBounds.height * 0.12;
    const expanded = {
      left: glyphBounds.x - toleranceX,
      top: glyphBounds.y - toleranceY,
      right: glyphBounds.x + glyphBounds.width + toleranceX,
      bottom: glyphBounds.y + glyphBounds.height + toleranceY
    };
    for (const stroke of strokes) {
      for (let i = 0; i < stroke.length; i++) {
        const point = stroke[i]!;
        const localX = point.x - glyphBounds.x;
        const localY = point.y - glyphBounds.y;
        const inside = point.x >= expanded.left && point.x <= expanded.right && point.y >= expanded.top && point.y <= expanded.bottom;
        if (inside) {
          pointCount++;
          minX = Math.min(minX, point.x);
          maxX = Math.max(maxX, point.x);
          minY = Math.min(minY, point.y);
          maxY = Math.max(maxY, point.y);
          const col = Math.floor(((localX + toleranceX) / (glyphBounds.width + toleranceX * 2)) * 6);
          const row = Math.floor(((localY + toleranceY) / (glyphBounds.height + toleranceY * 2)) * 6);
          if (col >= 0 && col < 6 && row >= 0 && row < 6) occupied.add(`${row}:${col}`);
          if (i > 0) {
            const previous = stroke[i - 1]!;
            const previousInside = previous.x >= expanded.left && previous.x <= expanded.right && previous.y >= expanded.top && previous.y <= expanded.bottom;
            if (previousInside) {
              length += Math.hypot(point.x - previous.x, point.y - previous.y);
            }
          }
        }
      }
    }
    const characterCount = Math.max(1, graphemeLength(current));
    const longSide = Math.max(glyphBounds.width, glyphBounds.height);
    const narrowGlyph = Math.min(glyphBounds.width, glyphBounds.height) / longSide < 0.4;
    const requiredLength = longSide * (narrowGlyph ? 0.38 : 0.45) * Math.sqrt(characterCount);
    const spreadEnough = (glyphBounds.width >= glyphBounds.height ? maxX - minX : maxY - minY) >= longSide * 0.35;
    const requiredCells = characterCount > 1 ? Math.min(22, 10 + (characterCount - 1) * 3) : narrowGlyph ? 6 : 10;
    if (pointCount >= 16 && length >= requiredLength && spreadEnough && occupied.size >= requiredCells) {
      setCompleted((items) => items.includes(index) ? items : [...items, index]);
      setCheckMessage('');
      setBurstCount((count) => count + 1);
      speakText(strings.tracePassed, traceModeLang(mode) === 'hi' ? 'hi-IN' : 'en-US');
      if (index < pool.length - 1) {
        nextTimerRef.current = setTimeout(() => {
          setIndex(index + 1);
          setStrokes([]);
          activeStrokeRef.current = [];
          setActiveStroke([]);
          setCheckMessage('');
          speakText(pool[index + 1]!, traceModeLang(mode) === 'hi' ? 'hi-IN' : 'en-US');
        }, 950);
      } else {
        setCheckMessage('🎉 ⭐ 🌈');
      }
    } else {
      setCheckMessage(strings.traceNeedMore);
    }
  };

  const goNext = () => {
    if (index < pool.length - 1 && completed.includes(index)) {
      setIndex(index + 1);
      clear();
      speakText(pool[index + 1]!, traceModeLang(mode) === 'hi' ? 'hi-IN' : 'en-US');
    }
  };
  const goPrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      clear();
      speakText(pool[index - 1]!, traceModeLang(mode) === 'hi' ? 'hi-IN' : 'en-US');
    }
  };

  const relativePoint = (e: NativeSyntheticEvent<NativeTouchEvent>): Point => ({
    x: e.nativeEvent.locationX,
    y: e.nativeEvent.locationY
  });

  // Use native touch events directly. PanResponder can lose move/release events
  // on Android when the canvas is inside a nested scrollable screen.
  const startStroke = (event: NativeSyntheticEvent<NativeTouchEvent>) => {
    const point = relativePoint(event);
    activeStrokeRef.current = [point];
    setActiveStroke([point]);
  };
  const extendStroke = (event: NativeSyntheticEvent<NativeTouchEvent>) => {
    const previousPoints = activeStrokeRef.current;
    if (previousPoints.length === 0 || previousPoints.length >= 1200) return;
    const point = relativePoint(event);
    const last = previousPoints[previousPoints.length - 1]!;
    const distance = Math.hypot(point.x - last.x, point.y - last.y);
    if (distance < 1) return;
    // Interpolate between Android touch samples so quick finger movement still
    // leaves a continuous line instead of disconnected dots.
    const steps = Math.ceil(distance / 5);
    const additions = Array.from({ length: steps }, (_, i) => ({
      x: last.x + ((point.x - last.x) * (i + 1)) / steps,
      y: last.y + ((point.y - last.y) * (i + 1)) / steps
    }));
    const nextPoints = [...previousPoints, ...additions].slice(-1200);
    activeStrokeRef.current = nextPoints;
    setActiveStroke(nextPoints);
  };
  const finishStroke = () => {
    const finished = activeStrokeRef.current;
    if (finished.length > 1) setStrokes((existing) => [...existing, finished]);
    activeStrokeRef.current = [];
    setActiveStroke([]);
  };

  const isCursive = mode === 'cursive';
  const canGoNext = index < pool.length - 1 && completed.includes(index);

  return (
    <ThemedScreen
      title={strings.traceName}
      language={language}
      onBack={onExit}
      headerRight={<Text style={styles.meta}>{index + 1} / {pool.length}</Text>}
      scroll={false}
    >
      <Pressable
        style={styles.title}
        onPress={() => current && speakText(current, traceModeLang(mode) === 'hi' ? 'hi-IN' : 'en-US')}
      >
        <Text style={styles.titleText}>{'✍️ '}{current || '—'}</Text>
      </Pressable>

      <Text style={styles.subtitle}>{checkMessage || strings.traceSub}</Text>

      {/* Mode picker */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.modeRow}
      >
        {MODES.map((m) => {
          const active = mode === m.id;
          return (
            <Pressable
              key={m.id}
              style={[styles.modeBtn, active && styles.modeBtnActive]}
              onPress={() => changeMode(m.id)}
            >
              <Text style={[styles.modeBtnText, active && styles.modeBtnTextActive]}>
                {/* Fallback labels — i18n applied below via strings prop pattern would be nicer */}
                {strings[m.labelKey] ?? LABEL_FOR_MODE[m.id]}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Drawing canvas */}
      <View
        collapsable={false}
        pointerEvents="box-only"
        style={styles.canvas}
        onLayout={(event: LayoutChangeEvent) => {
          setCanvasSize({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height });
        }}
        onTouchStart={startStroke}
        onTouchMove={extendStroke}
        onTouchEnd={finishStroke}
        onTouchCancel={finishStroke}
      >
        {/* Ghost character */}
        <Text
          pointerEvents="none"
          onLayout={(event: LayoutChangeEvent) => setGlyphBounds(event.nativeEvent.layout)}
          style={[
            styles.ghostChar,
            { fontSize: Math.min(280, windowWidth * 0.78), lineHeight: Math.min(310, windowWidth * 0.86) },
            isCursive && styles.ghostCharCursive,
            mode === 'hindiWords' && styles.ghostCharWord
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {current}
        </Text>

        {/* User's ink */}
        <Svg
          style={StyleSheet.absoluteFill}
          width={canvasSize.width || '100%'}
          height={canvasSize.height || '100%'}
          viewBox={`0 0 ${canvasSize.width || 1} ${canvasSize.height || 1}`}
          pointerEvents="none"
        >
          {strokes.map((stroke, i) => stroke.length ? (
            <Path
              key={i}
              d={pointsToPath(stroke)}
              stroke="#e26a89"
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ) : null)}
          {activeStroke.length ? (
            <Path
              key="active-trace"
              d={pointsToPath(activeStroke)}
              stroke="#e26a89"
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ) : null}
        </Svg>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Pressable style={[styles.ctrlBtn, styles.ctrlGhost]} onPress={goPrev} disabled={index === 0}>
          <Text numberOfLines={1} style={styles.ctrlGhostText}>{strings.tracePrev}</Text>
        </Pressable>
        <Pressable style={[styles.ctrlBtn, styles.ctrlGhost]} onPress={clear}>
          <Text numberOfLines={1} style={styles.ctrlGhostText}>{strings.traceClear}</Text>
        </Pressable>
        <Pressable style={[styles.ctrlBtn, styles.ctrlPrimary]} onPress={checkTrace}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.ctrlPrimaryText}>{strings.traceCheck}</Text>
        </Pressable>
        <Pressable
          style={[styles.ctrlBtn, styles.ctrlGhost, !canGoNext && styles.ctrlDisabled]}
          onPress={goNext}
          disabled={!canGoNext}
        >
          <Text numberOfLines={1} style={styles.ctrlGhostText}>{strings.traceNext}</Text>
        </Pressable>
      </View>

      <MiniConfetti trigger={burstCount} />
    </ThemedScreen>
  );
}

const LABEL_FOR_MODE: Record<TraceMode, string> = {
  caps: 'A B C',
  small: 'a b c',
  cursive: '𝒜 ℬ 𝒞',
  hindiLetters: 'अ आ इ',
  hindiWords: 'आम'
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f3f0ff', padding: 12, alignItems: 'center' },
  header: {
    width: '100%',
    maxWidth: 520,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8
  },
  title: { flexShrink: 1 },
  titleText: { fontSize: 20, fontWeight: '900', color: '#0c615d' },
  meta: { fontSize: 14, fontWeight: '800', color: '#6b7280' },
  subtitle: { fontSize: 13, fontWeight: '700', color: '#6b7280', marginBottom: 4 },

  modeRow: { gap: 8, paddingHorizontal: 4, paddingBottom: 8, alignItems: 'center' },
  modeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e5f0',
    minWidth: 60,
    alignItems: 'center'
  },
  modeBtnActive: { backgroundColor: '#147d78', borderColor: '#0c615d' },
  modeBtnText: { fontWeight: '800', color: '#1e1b4b', fontSize: 14 },
  modeBtnTextActive: { color: '#fff' },

  canvas: {
    width: '100%',
    maxWidth: 520,
    aspectRatio: 1,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    marginVertical: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  ghostChar: {
    maxWidth: '96%',
    includeFontPadding: false,
    fontSize: 280,
    fontWeight: '900',
    color: 'rgba(75, 60, 120, 0.28)',
    textAlign: 'center',
    lineHeight: 310,
    textAlignVertical: 'center'
  },
  ghostCharCursive: {
    fontStyle: 'italic',
    fontWeight: '400',
    fontFamily: undefined
  },
  ghostCharWord: {
    fontSize: 140,
    lineHeight: 180
  },

  controls: {
    marginTop: 4,
    width: '100%',
    maxWidth: 520,
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'nowrap',
    justifyContent: 'center'
  },
  ctrlBtn: { flexShrink: 1, paddingHorizontal: 10, paddingVertical: 12, borderRadius: 999, minWidth: 48, alignItems: 'center', justifyContent: 'center' },
  ctrlPrimary: { backgroundColor: '#147d78' },
  ctrlPrimaryText: { color: '#fff', fontWeight: '900' },
  ctrlGhost: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#e5e5f0' },
  ctrlGhostText: { color: '#1e1b4b', fontWeight: '900', fontSize: 16, textAlign: 'center' },
  ctrlDisabled: { opacity: 0.45 },

  back: {
    marginTop: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e5f0'
  },
  backText: { fontWeight: '800', color: '#1e1b4b' }
});

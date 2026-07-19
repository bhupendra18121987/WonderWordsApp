import { useMemo, useRef, useState } from 'react';
import {
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type PanResponderGestureState
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { AgeGroupKey, Language } from '../core/types';
import { t } from '../core/i18n';
import { tracePool, type TraceMode } from '../core/data/tracePool';
import ThemedScreen from './ThemedScreen';

interface TraceLetterGameProps {
  ageGroup: AgeGroupKey;
  language: Language;
  onExit: () => void;
  /** Speaks a character/word in the given TTS language. */
  speakText: (text: string) => void;
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
 * their finger to trace over it. We do not check the accuracy of the
 * traced line (that would need per-glyph SVG paths) — this is a
 * practice / familiarisation activity.
 */
export default function TraceLetterGame({
  ageGroup,
  language,
  onExit,
  speakText
}: TraceLetterGameProps) {
  const strings = t(language);
  const [mode, setMode] = useState<TraceMode>('caps');
  const [index, setIndex] = useState(0);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const currentStrokeRef = useRef<Point[]>([]);
  const canvasOriginRef = useRef({ x: 0, y: 0 });
  const canvasSizeRef = useRef({ w: 0, h: 0 });

  const pool = useMemo(() => tracePool(mode, ageGroup), [mode, ageGroup]);
  const current = pool[index] ?? '';

  // Reset when mode changes.
  const changeMode = (m: TraceMode) => {
    setMode(m);
    setIndex(0);
    setStrokes([]);
    currentStrokeRef.current = [];
  };

  const clear = () => {
    setStrokes([]);
    currentStrokeRef.current = [];
  };

  const goNext = () => {
    if (index < pool.length - 1) {
      setIndex(index + 1);
      clear();
      speakText(pool[index + 1]!);
    }
  };
  const goPrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      clear();
      speakText(pool[index - 1]!);
    }
  };

  const onCanvasLayout = (e: LayoutChangeEvent) => {
    canvasSizeRef.current = { w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height };
  };

  const relativePoint = (e: GestureResponderEvent): Point => {
    // locationX/Y are relative to the responder view (the canvas).
    return {
      x: e.nativeEvent.locationX,
      y: e.nativeEvent.locationY
    };
  };

  const panResponder = useMemo(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e: GestureResponderEvent) => {
        currentStrokeRef.current = [relativePoint(e)];
        setStrokes((s) => [...s, currentStrokeRef.current]);
      },
      onPanResponderMove: (e: GestureResponderEvent, _g: PanResponderGestureState) => {
        currentStrokeRef.current.push(relativePoint(e));
        // Trigger a re-render by updating strokes reference.
        setStrokes((s) => {
          const clone = s.slice();
          clone[clone.length - 1] = [...currentStrokeRef.current];
          return clone;
        });
      },
      onPanResponderRelease: () => {
        currentStrokeRef.current = [];
      },
      onPanResponderTerminate: () => {
        currentStrokeRef.current = [];
      }
    }),
    []
  );

  const isCursive = mode === 'cursive';

  return (
    <ThemedScreen
      title={strings.traceName}
      onBack={onExit}
      headerRight={<Text style={styles.meta}>{index + 1} / {pool.length}</Text>}
      scroll={false}
    >
      <Pressable
        style={styles.title}
        onPress={() => current && speakText(current)}
      >
        <Text style={styles.titleText}>{'✍️ '}{current || '—'}</Text>
      </Pressable>

      <Text style={styles.subtitle}>{strings.traceSub}</Text>

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
                {LABEL_FOR_MODE[m.id]}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Drawing canvas */}
      <View
        style={styles.canvas}
        onLayout={onCanvasLayout}
        {...panResponder.panHandlers}
      >
        {/* Ghost character */}
        <Text
          style={[
            styles.ghostChar,
            isCursive && styles.ghostCharCursive,
            mode === 'hindiWords' && styles.ghostCharWord
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {current}
        </Text>

        {/* User's ink */}
        <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
          {strokes.map((stroke, i) => (
            <Path
              key={i}
              d={pointsToPath(stroke)}
              stroke="#e26a89"
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}
        </Svg>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Pressable style={[styles.ctrlBtn, styles.ctrlGhost]} onPress={goPrev} disabled={index === 0}>
          <Text style={styles.ctrlGhostText}>{strings.tracePrev}</Text>
        </Pressable>
        <Pressable style={[styles.ctrlBtn, styles.ctrlPrimary]} onPress={clear}>
          <Text style={styles.ctrlPrimaryText}>{strings.traceClear}</Text>
        </Pressable>
        <Pressable
          style={[styles.ctrlBtn, styles.ctrlGhost]}
          onPress={goNext}
          disabled={index >= pool.length - 1}
        >
          <Text style={styles.ctrlGhostText}>{strings.traceNext}</Text>
        </Pressable>
      </View>
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
  titleText: { fontSize: 20, fontWeight: '900', color: '#6d28d9' },
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
  modeBtnActive: { backgroundColor: '#7c3aed', borderColor: '#6d28d9' },
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
    fontSize: 320,
    fontWeight: '900',
    color: 'rgba(75, 60, 120, 0.14)',
    textAlign: 'center',
    lineHeight: 380
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
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  ctrlBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 999, minWidth: 60, alignItems: 'center' },
  ctrlPrimary: { backgroundColor: '#7c3aed' },
  ctrlPrimaryText: { color: '#fff', fontWeight: '900' },
  ctrlGhost: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#e5e5f0' },
  ctrlGhostText: { color: '#1e1b4b', fontWeight: '900', fontSize: 18 },

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

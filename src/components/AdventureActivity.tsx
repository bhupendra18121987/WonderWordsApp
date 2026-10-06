import { useEffect, useMemo, useRef, useState } from 'react';
import {
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AgeGroupKey, Language } from '../core/types';
import { adventureInfo, adventureUI, createActivityQuestion, memoryPairs, type AdventureId } from '../core/adventures';
import { shuffleInPlace } from '../core/miniGames';
import ThemedScreen from './ThemedScreen';
import MiniConfetti from './MiniConfetti';

interface AdventureActivityProps {
  id: AdventureId;
  ageGroup: AgeGroupKey;
  language: Language;
  onExit: () => void;
  onComplete: (stars: number) => void;
  speakText: (text: string) => void;
}
interface Point { x: number; y: number }
interface Stroke { points: Point[]; color: string }

const PALETTE = ['#e94b6b', '#3578d4', '#39a76b', '#f2a528', '#147d78', '#1f2937'];
const MAX_DRAW_STROKES = 30;
const MAX_POINTS_PER_STROKE = 400;

export default function AdventureActivity({ id, ageGroup, language, onExit, onComplete, speakText }: AdventureActivityProps) {
  const title = adventureInfo(id, language);
  const ui = adventureUI(language);
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [burstCount, setBurstCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const answeredRef = useRef(false);
  const memoryMismatchRef = useRef(false);
  const mismatchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savePendingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (mismatchTimerRef.current) clearTimeout(mismatchTimerRef.current);
    };
  }, []);
  const animalOffset = useMemo(() => Math.floor(Math.random() * 6), [id]);
  const question = useMemo(() => id === 'memory' || id === 'drawing' ? null : createActivityQuestion(id, ageGroup, language, round, animalOffset), [id, ageGroup, language, round, animalOffset]);

  const pairSet = useMemo(() => memoryPairs(ageGroup), [ageGroup]);
  const cards = useMemo(() => shuffleInPlace([...pairSet, ...pairSet].map((pair, index) => ({ ...pair, cardId: `${pair.id}-${index}` }))), [pairSet]);
  const [openedCards, setOpenedCards] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [color, setColor] = useState(PALETTE[0]!);
  const activeStroke = useRef<Stroke | null>(null);
  const strokeCountRef = useRef(0);

  useEffect(() => {
    if (id === 'memory') speakText(ui.memoryPrompt);
    else if (id === 'drawing') speakText(title.subtitle);
    else if (question) {
      speakText(id === 'animals' ? `${question.prompt} ${question.visual}` : question.prompt);
    }
  }, [id, question, speakText, title.subtitle, ui.memoryPrompt]);

  const answer = (choiceId: string) => {
    if (!question || answeredRef.current || answered || finished) return;
    if (choiceId === question.answer) {
      answeredRef.current = true;
      setAnswered(true);
      setFeedback(question.success);
      setCorrectCount((n) => n + 1);
      setBurstCount((n) => n + 1);
      speakText(question.success);
      if (id === 'story') {
        setFinished(true);
        onComplete(2);
      }
    } else {
      setFeedback(question.retry);
      speakText(question.retry);
    }
  };

  const nextQuestion = () => {
    if (!answered || finished || !question) return;
    if (round >= 4) {
      setFinished(true);
      speakText(ui.finish);
      onComplete(correctCount >= 4 ? 3 : 2);
      return;
    }
    setRound((n) => n + 1);
    setAnswered(false);
    setFeedback('');
    answeredRef.current = false;
  };

  const tapMemoryCard = (cardId: string, pairId: string) => {
    if (memoryMismatchRef.current || matched.includes(pairId) || openedCards.length >= 2 || openedCards.includes(cardId)) return;
    const next = [...openedCards, cardId];
    setOpenedCards(next);
    const tappedPair = pairSet.find((pair) => pair.id === pairId);
    if (tappedPair) speakText(tappedPair.label[language]);
    if (next.length === 2) {
      const firstPair = cards.find((card) => card.cardId === next[0])?.id;
      if (firstPair === pairId) {
        const nextMatched = [...matched, pairId];
        setMatched(nextMatched);
        setBurstCount((n) => n + 1);
        setOpenedCards([]);
        speakText(ui.success);
        if (nextMatched.length === pairSet.length) {
          setFinished(true);
          onComplete(3);
        }
      } else {
        memoryMismatchRef.current = true;
        setFeedback(language === 'hi' ? 'फिर कोशिश!' : 'Try again!');
        speakText(language === 'hi' ? 'फिर कोशिश!' : 'Try again!');
        mismatchTimerRef.current = setTimeout(() => { setOpenedCards([]); memoryMismatchRef.current = false; }, 850);
      }
    }
  };

  const pointFromEvent = (event: GestureResponderEvent) => ({ x: event.nativeEvent.locationX, y: event.nativeEvent.locationY });
  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: (event) => {
      if (strokeCountRef.current >= MAX_DRAW_STROKES) return;
      strokeCountRef.current += 1;
      const stroke = { points: [pointFromEvent(event)], color };
      activeStroke.current = stroke;
      setStrokes((existing) => [...existing, stroke]);
    },
    onPanResponderMove: (event) => {
      const currentStroke = activeStroke.current;
      if (!currentStroke) return;
      const nextPoint = pointFromEvent(event);
      const currentPoints = currentStroke.points;
      const previous = currentPoints[currentPoints.length - 1];
      if (currentPoints.length >= MAX_POINTS_PER_STROKE || (previous && Math.hypot(nextPoint.x - previous.x, nextPoint.y - previous.y) < 3)) return;
      const updatedStroke = { ...currentStroke, points: [...currentPoints, nextPoint] };
      activeStroke.current = updatedStroke;
      setStrokes((existing) => {
        if (existing.length === 0) return existing;
        const copy = existing.slice();
        copy[copy.length - 1] = updatedStroke;
        return copy;
      });
    },
    onPanResponderRelease: () => { activeStroke.current = null; },
    onPanResponderTerminate: () => { activeStroke.current = null; }
  }), [color]);

  const saveDrawing = async () => {
    if (savePendingRef.current || finished) return;
    if (strokes.length === 0) {
      setFeedback(language === 'hi' ? 'पहले तस्वीर बनाओ।' : 'Draw something first.');
      return;
    }
    try {
      savePendingRef.current = true;
      await AsyncStorage.setItem('ww:artwork:last', JSON.stringify({ strokes, savedAt: new Date().toISOString() }));
      setFeedback(ui.drawSaved);
      setBurstCount((n) => n + 1);
      speakText(ui.success);
      setFinished(true);
      onComplete(1);
    } catch {
      savePendingRef.current = false;
      setFeedback(language === 'hi' ? 'तस्वीर सहेजी नहीं जा सकी।' : 'Could not save this picture.');
    }
  };

  return (
    <ThemedScreen title={title.name} language={language} onBack={onExit} scroll={id !== 'drawing'} contentBottomPadding={24}>
      {title.subtitle !== title.name ? <Text style={styles.subtitle}>{title.subtitle}</Text> : null}
      <Text style={styles.noTimer}>{ui.noLives}</Text>

      {finished ? (
        <View style={styles.finishCard}>
          <Text style={styles.finishEmoji}>🎉</Text>
          <Text style={styles.finishTitle}>{ui.finish}</Text>
          <Pressable style={styles.primaryButton} onPress={onExit}><Text style={styles.primaryText}>{language === 'hi' ? 'दुनिया में वापस' : 'Back to my world'}</Text></Pressable>
        </View>
      ) : id === 'drawing' ? (
        <>
          <View
            style={styles.drawingCanvas}
            {...panResponder.panHandlers}
          >
            <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
              {strokes.map((stroke, index) => stroke?.points?.length ? <Path key={index} d={stroke.points.map((point, i) => `${i ? 'L' : 'M'}${point.x},${point.y}`).join(' ')} stroke={stroke.color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" /> : null)}
            </Svg>
          </View>
          <View style={styles.palette}>{PALETTE.map((swatch) => <Pressable key={swatch} accessibilityRole="button" accessibilityLabel={swatch} onPress={() => setColor(swatch)} style={[styles.swatch, { backgroundColor: swatch }, color === swatch && styles.swatchActive]} />)}</View>
          <View style={styles.actionRow}>
            <Pressable style={styles.secondaryButton} onPress={() => { activeStroke.current = null; setStrokes([]); strokeCountRef.current = 0; setFeedback(''); }}><Text style={styles.secondaryText}>{ui.drawClear}</Text></Pressable>
            <Pressable style={styles.primaryButton} onPress={saveDrawing}><Text style={styles.primaryText}>{ui.drawSave}</Text></Pressable>
          </View>
        </>
      ) : id === 'memory' ? (
        <>
          <Text style={styles.prompt}>{ui.memoryPrompt}</Text>
          <View style={styles.memoryGrid}>{cards.map((card) => {
            const visible = openedCards.includes(card.cardId) || matched.includes(card.id);
            return <Pressable key={card.cardId} onPress={() => tapMemoryCard(card.cardId, card.id)} accessibilityRole="button" accessibilityLabel={visible ? card.label[language] : (language === 'hi' ? 'छुपा कार्ड' : 'Hidden card')} style={[styles.memoryCard, visible && styles.memoryCardVisible, matched.includes(card.id) && styles.memoryCardMatched]}>
              <Text style={styles.memoryEmoji}>{visible ? card.emoji : '❔'}</Text>
              {visible && <Text style={styles.choiceLabel}>{card.label[language]}</Text>}
            </Pressable>;
          })}</View>
          {!!feedback && <Text style={styles.feedback}>{feedback}</Text>}
        </>
      ) : question ? (
        <>
          <Text style={styles.round}>{round + 1} / 5</Text>
          <Text style={styles.prompt}>{question.prompt}</Text>
          <Text style={styles.visual}>{question.visual}</Text>
          <View style={styles.choiceGrid}>{question.choices.map((choice) => <Pressable key={choice.id} accessibilityRole="button" onPress={() => answer(choice.id)} disabled={answered} style={[styles.choiceCard, answered && choice.id === question.answer && styles.choiceCorrect]}>
            <Text style={styles.choiceEmoji}>{choice.emoji}</Text><Text style={styles.choiceLabel}>{choice.label}</Text>
          </Pressable>)}</View>
          {!!feedback && <Text style={styles.feedback}>{feedback}</Text>}
          {answered && !finished && <Pressable style={styles.primaryButton} onPress={nextQuestion}><Text style={styles.primaryText}>{ui.next}</Text></Pressable>}
        </>
      ) : null}
      <MiniConfetti trigger={burstCount} />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  subtitle: { color: '#655c7d', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  noTimer: { color: '#8b84a0', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  prompt: { color: '#342554', fontSize: 23, lineHeight: 30, fontWeight: '900', textAlign: 'center', marginTop: 8 },
  visual: { fontSize: 44, lineHeight: 64, textAlign: 'center', marginVertical: 8 },
  round: { alignSelf: 'flex-end', color: '#147d78', fontSize: 14, fontWeight: '900' },
  choiceGrid: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  choiceCard: { flexGrow: 1, flexBasis: 100, maxWidth: 160, minWidth: 88, minHeight: 104, padding: 12, borderRadius: 22, backgroundColor: '#f2edff', borderWidth: 2, borderColor: '#e3d9ff', alignItems: 'center', justifyContent: 'center', gap: 6 },
  choiceCorrect: { backgroundColor: '#d6f6e3', borderColor: '#4abd7d' },
  choiceEmoji: { fontSize: 36 },
  choiceLabel: { color: '#342554', fontSize: 16, fontWeight: '800', textAlign: 'center' },
  feedback: { color: '#24955d', fontSize: 17, fontWeight: '900', textAlign: 'center', marginVertical: 6 },
  primaryButton: { minHeight: 50, borderRadius: 25, backgroundColor: '#147d78', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, alignSelf: 'center' },
  primaryText: { color: '#fff', fontSize: 17, fontWeight: '900' },
  secondaryButton: { minHeight: 50, borderRadius: 25, backgroundColor: '#eee8ff', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22 },
  secondaryText: { color: '#4c3679', fontSize: 16, fontWeight: '900' },
  actionRow: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  memoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  memoryCard: { width: 104, height: 112, borderRadius: 22, backgroundColor: '#9b70ed', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#8051dc' },
  memoryCardVisible: { backgroundColor: '#fff', borderColor: '#ded3ff' },
  memoryCardMatched: { backgroundColor: '#dcf8e8', borderColor: '#69c793' },
  memoryEmoji: { fontSize: 40 },
  drawingCanvas: { width: '100%', minHeight: 280, flex: 1, borderRadius: 24, backgroundColor: '#fff', borderWidth: 2, borderColor: '#e8e2f3', overflow: 'hidden' },
  palette: { flexDirection: 'row', justifyContent: 'center', gap: 12, padding: 8 },
  swatch: { width: 34, height: 34, borderRadius: 17, borderWidth: 3, borderColor: '#fff' },
  swatchActive: { transform: [{ scale: 1.18 }], borderColor: '#342554' },
  finishCard: { alignItems: 'center', gap: 12, paddingVertical: 24 },
  finishEmoji: { fontSize: 68 },
  finishTitle: { color: '#4c3679', fontSize: 24, fontWeight: '900', textAlign: 'center' }
});

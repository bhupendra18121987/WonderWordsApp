import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { AgeGroupKey, Language } from '../core/types';
import { t } from '../core/i18n';
import { shuffleInPlace } from '../core/miniGames';
import { pickPairsForAge, type AntonymPair } from '../core/data/antonyms';
import MiniConfetti from './MiniConfetti';

interface AntonymPairsGameProps {
  ageGroup: AgeGroupKey;
  language: Language;
  onExit: () => void;
  speakText: (text: string) => void;
}

/** Runtime card model — each pair produces two cards (position 0 / 1). */
interface Card {
  cardId: string; // unique per card
  pairId: string; // shared between the two cards in a pair
  label: string;
  emoji?: string;
}

function buildDeck(pairs: AntonymPair[], lang: Language): Card[] {
  const cards: Card[] = [];
  pairs.forEach((p) => {
    const [a, b] = p.labels[lang];
    const [ea, eb] = p.emoji ?? [undefined, undefined];
    cards.push({ cardId: `${p.id}-0`, pairId: p.id, label: a, emoji: ea });
    cards.push({ cardId: `${p.id}-1`, pairId: p.id, label: b, emoji: eb });
  });
  return shuffleInPlace(cards);
}

export default function AntonymPairsGame({
  ageGroup,
  language,
  onExit,
  speakText
}: AntonymPairsGameProps) {
  const strings = t(language);
  const initialPairs = useMemo(() => pickPairsForAge(ageGroup), [ageGroup]);
  const initialDeck = useMemo(() => buildDeck(initialPairs, language), [initialPairs, language]);

  const [deck, setDeck] = useState<Card[]>(initialDeck);
  const [flipped, setFlipped] = useState<string[]>([]); // cardIds currently face-up (max 2)
  const [matched, setMatched] = useState<Set<string>>(new Set()); // matched pairIds
  const [wrongPair, setWrongPair] = useState<string[]>([]); // cardIds briefly shown as mismatch
  const [attempts, setAttempts] = useState(0);
  const [burstCount, setBurstCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (matched.size === initialPairs.length && initialPairs.length > 0) {
      setDone(true);
      speakText(strings.correctFeedback);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched]);

  const isFaceUp = (card: Card) =>
    matched.has(card.pairId) ||
    flipped.includes(card.cardId) ||
    wrongPair.includes(card.cardId);

  const handleTap = (card: Card) => {
    if (matched.has(card.pairId)) return;
    if (flipped.includes(card.cardId)) return;
    if (wrongPair.length > 0) return;
    speakText(card.label);

    if (flipped.length === 0) {
      setFlipped([card.cardId]);
      return;
    }
    // Second flip → evaluate.
    const firstId = flipped[0]!;
    const firstCard = deck.find((c) => c.cardId === firstId);
    setAttempts((a) => a + 1);
    if (firstCard && firstCard.pairId === card.pairId && firstCard.cardId !== card.cardId) {
      // Match!
      setFlipped([]);
      setMatched((m) => new Set(m).add(card.pairId));
      setBurstCount((b) => b + 1);
    } else {
      // Mismatch — flash both face-up, then flip back.
      setWrongPair([firstId, card.cardId]);
      setFlipped([]);
      setTimeout(() => setWrongPair([]), 900);
    }
  };

  const restart = () => {
    const nextPairs = pickPairsForAge(ageGroup);
    setDeck(buildDeck(nextPairs, language));
    setFlipped([]);
    setMatched(new Set());
    setWrongPair([]);
    setAttempts(0);
    setDone(false);
  };

  if (done) {
    return (
      <View style={styles.root}>
        <View style={styles.doneCard}>
          <Text style={styles.doneEmoji}>🏆</Text>
          <Text style={styles.doneTitle}>{strings.correctFeedback}</Text>
          <Text style={styles.doneScore}>
            {strings.scoreLabel(initialPairs.length)} · {attempts} taps
          </Text>
          <View style={styles.doneRow}>
            <Pressable style={[styles.actionBtn, styles.primaryBtn]} onPress={restart}>
              <Text style={styles.primaryBtnText}>🔄 {strings.playAgain}</Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, styles.ghostBtn]} onPress={onExit}>
              <Text style={styles.ghostBtnText}>{strings.home}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>{strings.antonymName}</Text>
        <Text style={styles.headerRight}>
          {matched.size} / {initialPairs.length}
        </Text>
      </View>

      <Text style={styles.prompt}>{strings.antonymPrompt}</Text>

      <View style={styles.grid}>
        {deck.map((card) => {
          const faceUp = isFaceUp(card);
          const isMatched = matched.has(card.pairId);
          const isWrong = wrongPair.includes(card.cardId);
          return (
            <Pressable
              key={card.cardId}
              style={({ pressed }) => [
                styles.card,
                faceUp && styles.cardFace,
                isMatched && styles.cardMatched,
                isWrong && styles.cardWrong,
                pressed && !isMatched && styles.cardPressed
              ]}
              onPress={() => handleTap(card)}
              accessibilityRole="button"
              accessibilityLabel={faceUp ? card.label : 'hidden card'}
            >
              {faceUp ? (
                <>
                  {card.emoji && <Text style={styles.cardEmoji}>{card.emoji}</Text>}
                  <Text style={styles.cardText} numberOfLines={2}>
                    {card.label}
                  </Text>
                </>
              ) : (
                <Text style={styles.cardBack}>?</Text>
              )}
            </Pressable>
          );
        })}
      </View>

      <Pressable style={styles.back} onPress={onExit}>
        <Text style={styles.backText}>← {strings.home}</Text>
      </Pressable>

      <MiniConfetti trigger={burstCount} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f3f0ff', padding: 16, alignItems: 'center' },
  header: {
    width: '100%',
    maxWidth: 520,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4
  },
  title: { fontSize: 20, fontWeight: '900', color: '#6d28d9' },
  headerRight: { fontSize: 14, fontWeight: '800', color: '#6b7280' },
  prompt: { fontSize: 14, fontWeight: '700', color: '#6b7280', marginBottom: 12, textAlign: 'center' },

  grid: {
    width: '100%',
    maxWidth: 520,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center'
  },
  card: {
    width: 100,
    height: 120,
    borderRadius: 18,
    backgroundColor: '#9b5de5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderWidth: 3,
    borderColor: 'transparent'
  },
  cardFace: { backgroundColor: '#ffffff' },
  cardMatched: {
    backgroundColor: '#e0f6e8',
    borderColor: '#4ec37a',
    opacity: 0.85
  },
  cardWrong: { backgroundColor: '#ffe0e6', borderColor: '#ef4b6b' },
  cardPressed: { transform: [{ scale: 0.94 }], opacity: 0.9 },
  cardBack: { fontSize: 36, fontWeight: '900', color: '#fff' },
  cardEmoji: { fontSize: 30 },
  cardText: { fontSize: 14, fontWeight: '800', color: '#1e1b4b', textAlign: 'center' },

  back: {
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e5f0'
  },
  backText: { fontWeight: '800', color: '#1e1b4b' },

  doneCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 10,
    marginTop: 40,
    width: '100%',
    maxWidth: 460
  },
  doneEmoji: { fontSize: 56 },
  doneTitle: { fontSize: 22, fontWeight: '900', color: '#6d28d9' },
  doneScore: { fontSize: 16, fontWeight: '800', color: '#1e1b4b' },
  doneRow: { flexDirection: 'row', gap: 10, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' },
  actionBtn: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 999 },
  primaryBtn: { backgroundColor: '#7c3aed' },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
  ghostBtn: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#e5e5f0' },
  ghostBtnText: { color: '#1e1b4b', fontWeight: '800' }
});

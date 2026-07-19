import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { TOKEN_PAIRS, randomTokenPairIndex, type Token } from '../core/data/tokens';
import {
  aiMove,
  availableMoves,
  emptyBoard,
  findWinner,
  isDraw,
  type TttCell,
  type Difficulty
} from '../core/ticTacToe';
import { t } from '../core/i18n';
import { pickPraise } from '../core/gameLogic';
import Celebration from './Celebration';
import ThemedScreen from './ThemedScreen';
import type { AgeGroupKey, Language } from '../core/types';

interface TicTacToeGameProps {
  ageGroup: AgeGroupKey;
  language: Language;
  onExit: () => void;
  speakText: (text: string) => void;
  onSetMascotMessage?: (msg: string) => void;
}

const DIFFICULTY_BY_AGE: Record<AgeGroupKey, Difficulty> = {
  '3-4': 'easy',
  '5-6': 'medium',
  '7-8': 'hard'
};

export default function TicTacToeGame({
  ageGroup,
  language,
  onExit,
  speakText,
  onSetMascotMessage
}: TicTacToeGameProps) {
  const strings = t(language);
  const difficulty = DIFFICULTY_BY_AGE[ageGroup];

  const [pairIndex, setPairIndex] = useState(() => randomTokenPairIndex());
  const [board, setBoard] = useState<TttCell[]>(() => emptyBoard());
  const [turn, setTurn] = useState<1 | -1>(1);
  const [result, setResult] = useState<{ outcome: 'win' | 'lose' | 'tie'; line?: readonly [number, number, number] } | null>(null);
  const [playerStarts, setPlayerStarts] = useState(true);
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const praiseRef = useRef<string>('');

  const [playerToken, owlToken] = TOKEN_PAIRS[pairIndex]!;
  const playerLabel = playerToken.labels[language];
  const owlLabel = owlToken.labels[language];
  const winSet = useMemo(() => new Set(result?.line ?? []), [result]);

  const finish = useCallback((nextBoard: TttCell[]) => {
    const w = findWinner(nextBoard);
    if (w) {
      const outcome: 'win' | 'lose' = w.winner === 1 ? 'win' : 'lose';
      setResult({ outcome, line: w.line });
      if (outcome === 'win') {
        praiseRef.current = pickPraise(language);
        speakText(praiseRef.current);
        onSetMascotMessage?.(strings.youWon);
      } else {
        speakText(strings.owlWon);
        onSetMascotMessage?.(strings.owlWon);
      }
      return true;
    }
    if (isDraw(nextBoard)) {
      setResult({ outcome: 'tie' });
      speakText(strings.itsATie);
      onSetMascotMessage?.(strings.itsATie);
      return true;
    }
    return false;
  }, [language, speakText, onSetMascotMessage, strings]);

  const handleCellTap = (idx: number) => {
    if (result || turn !== 1 || board[idx] !== 0) return;
    const next = board.slice();
    next[idx] = 1;
    setBoard(next);
    speakText(playerLabel);
    if (!finish(next)) setTurn(-1);
  };

  // AI turn
  useEffect(() => {
    if (result || turn !== -1) return;
    aiTimerRef.current = setTimeout(() => {
      aiTimerRef.current = null;
      const move = aiMove(board, difficulty);
      if (move < 0 || availableMoves(board).length === 0) return;
      const next = board.slice();
      next[move] = -1;
      setBoard(next);
      speakText(owlLabel);
      if (!finish(next)) setTurn(1);
    }, 700);
    return () => {
      if (aiTimerRef.current) {
        clearTimeout(aiTimerRef.current);
        aiTimerRef.current = null;
      }
    };
  }, [turn, board, result, difficulty, owlLabel, speakText, finish]);

  useEffect(() => {
    if (result) return;
    onSetMascotMessage?.(turn === 1 ? strings.yourTurn : strings.owlTurn);
  }, [turn, result, strings.yourTurn, strings.owlTurn, onSetMascotMessage]);

  const startNewGame = () => {
    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }
    setBoard(emptyBoard());
    setResult(null);
    setPairIndex((prev) => randomTokenPairIndex(prev));
    const nextPlayerStarts = !playerStarts;
    setPlayerStarts(nextPlayerStarts);
    setTurn(nextPlayerStarts ? 1 : -1);
  };

  return (
    <ThemedScreen title={strings.ticTacToeName} onBack={onExit} scroll={false}>
      <View style={styles.header}>
        <TokenBadge
          who={strings.you}
          token={playerToken}
          language={language}
          active={turn === 1 && !result}
          tone="player"
        />
        <Text style={styles.vs}>VS</Text>
        <TokenBadge
          who={strings.owl}
          token={owlToken}
          language={language}
          active={turn === -1 && !result}
          tone="owl"
        />
      </View>

      <View style={styles.board}>
        {[0, 1, 2].map((r) => (
          <View key={r} style={styles.boardRow}>
            {[0, 1, 2].map((c) => {
              const i = r * 3 + c;
              const cell = board[i]!;
              const win = winSet.has(i);
              const disabled = cell !== 0 || !!result || turn !== 1;
              return (
                <Pressable
                  key={i}
                  style={[
                    styles.cell,
                    cell === 1 && styles.cellPlayer,
                    cell === -1 && styles.cellOwl,
                    win && styles.cellWin
                  ]}
                  onPress={() => handleCellTap(i)}
                  disabled={disabled}
                >
                  {cell !== 0 && (
                    <View style={styles.cellContent}>
                      <Text style={styles.cellEmoji}>
                        {cell === 1 ? playerToken.emoji : owlToken.emoji}
                      </Text>
                      <Text style={styles.cellWord}>
                        {cell === 1 ? playerLabel : owlLabel}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {result && result.outcome !== 'win' && (
        <View style={[styles.resultBanner, result.outcome === 'lose' ? styles.resultLose : styles.resultTie]}>
          <Text style={styles.resultEmoji}>
            {result.outcome === 'lose' ? '🦉' : '🤝'}
          </Text>
          <Text style={styles.resultText}>
            {result.outcome === 'lose' ? strings.owlWon : strings.itsATie}
          </Text>
        </View>
      )}

      <View style={styles.buttons}>
        <Pressable style={[styles.btn, styles.btnPrimary]} onPress={startNewGame}>
          <Text style={styles.btnPrimaryText}>
            {result ? strings.playAgain : strings.newGame}
          </Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.btnGhost]} onPress={onExit}>
          <Text style={styles.btnGhostText}>{strings.home}</Text>
        </Pressable>
      </View>

      <Celebration
        visible={result?.outcome === 'win'}
        praise={strings.youWon}
        subtitle={strings.ticTacToeSub}
        stars={3}
        showStars={false}
        nextLabel={strings.playAgain}
        homeLabel={strings.home}
        onNext={startNewGame}
        onHome={onExit}
      />
    </ThemedScreen>
  );
}

interface TokenBadgeProps {
  who: string;
  token: Token;
  language: Language;
  active: boolean;
  tone: 'player' | 'owl';
}

function TokenBadge({ who, token, language, active, tone }: TokenBadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        active && (tone === 'player' ? styles.badgePlayerActive : styles.badgeOwlActive)
      ]}
    >
      <Text style={styles.badgeEmoji}>{token.emoji}</Text>
      <View>
        <Text style={styles.badgeWho}>{who}</Text>
        <Text style={styles.badgeWord}>{token.labels[language]}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#f3f0ff',
    gap: 16,
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  vs: {
    fontSize: 18,
    fontWeight: '800',
    color: '#6b7280',
    letterSpacing: 1
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    minWidth: 120,
    borderWidth: 3,
    borderColor: 'transparent'
  },
  badgePlayerActive: {
    backgroundColor: '#ede9fe',
    borderColor: '#7c3aed'
  },
  badgeOwlActive: {
    backgroundColor: '#e5f2ff',
    borderColor: '#6ec9ff'
  },
  badgeEmoji: { fontSize: 30, lineHeight: 36 },
  badgeWho: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  badgeWord: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e1b4b'
  },
  board: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6
  },
  boardRow: {
    flexDirection: 'row',
    gap: 8
  },
  cell: {
    width: 84,
    height: 84,
    backgroundColor: '#fef1d6',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent'
  },
  cellPlayer: {
    backgroundColor: '#ede9fe',
    borderColor: '#ff8fab66'
  },
  cellOwl: {
    backgroundColor: '#e5f2ff',
    borderColor: '#6ec9ff66'
  },
  cellWin: {
    borderColor: '#ffcf5c',
    shadowColor: '#ffcf5c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 4
  },
  cellContent: {
    alignItems: 'center',
    gap: 2
  },
  cellEmoji: { fontSize: 30, lineHeight: 34 },
  cellWord: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1e1b4b'
  },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999
  },
  resultLose: { backgroundColor: '#e5f2ff' },
  resultTie: { backgroundColor: '#fef3c7' },
  resultEmoji: { fontSize: 26, lineHeight: 30 },
  resultText: { fontSize: 16, fontWeight: '800', color: '#1e1b4b' },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4
  },
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 999,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnPrimary: { backgroundColor: '#7c3aed' },
  btnPrimaryText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  btnGhost: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#e5e5f0' },
  btnGhostText: { color: '#1e1b4b', fontWeight: '800', fontSize: 14 }
});

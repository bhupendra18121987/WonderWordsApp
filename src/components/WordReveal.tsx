import { useCallback, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { t } from '../core/i18n';
import { getLanguageConfig } from '../core/languages';
import useSpeech from '../hooks/useSpeech';
import { colors, radii } from '../core/theme';
import type { Language } from '../core/types';
import {
  CatCharacter,
  GreatJobBanner,
  GreatJobStarCluster,
  SpeakerIcon
} from './RevealAssets';
import { ConfettiBits } from './CelebrationAssets';

interface RevealItem {
  word: string;
  emoji: string;
  meaning: string;
  category?: string;
}

interface WordRevealProps {
  word: RevealItem | null;
  language?: Language;
  sound?: boolean;
  onClose: () => void;
}

function characterFor(word: string, emoji: string) {
  const w = word.trim().toLowerCase();
  if (w === 'cat') return <CatCharacter size={160} />;
  return (
    <View style={styles.emojiFrame}>
      <Text style={styles.emojiText}>{emoji}</Text>
    </View>
  );
}

/** Purple full-screen "Great Job!" reveal shown after finding a word. */
export default function WordReveal({ word, language = 'en', sound = true, onClose }: WordRevealProps) {
  const { width, height } = useWindowDimensions();
  const strings = t(language);
  const langCfg = getLanguageConfig(language);
  const { speak, cancel } = useSpeech({ enabled: sound, lang: langCfg.bcp47 });
  const speakWord = useCallback(() => {
    if (!word) return;
    speak(word.word, { rate: 0.98, pitch: 1.38, interrupt: true });
    speak(strings.correctFeedback, { rate: 0.98, pitch: 1.38, interrupt: false });
  }, [speak, word, strings.correctFeedback]);

  useEffect(() => {
    speakWord();
    return cancel;
  }, [speakWord, cancel]);

  if (!word) return null;

  const praise = strings.correctFeedback;
  const nextLabel = language === 'hi' ? 'अगला शब्द' : 'Next Word';
  return (
    <Modal transparent visible animationType="fade" onRequestClose={onClose}>
      <LinearGradient
        colors={['#147d78', '#0c615d']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.overlay}
      >
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <ConfettiBits width={width} height={height} />
        </View>

        <View style={styles.hero}>
          <GreatJobStarCluster width={220} height={90} />
          <View style={styles.bannerWrap}>
            <GreatJobBanner width={Math.min(340, width - 40)}>{praise}</GreatJobBanner>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.word}>{word.word.toUpperCase()}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={strings.speakWord(word.word)}
              onPress={speakWord}
              style={({ pressed }) => [styles.speakerBtn, pressed && styles.pressed]}
            >
              <SpeakerIcon size={20} />
            </Pressable>
          </View>

          <View style={styles.character}>{characterFor(word.word, word.emoji)}</View>

          <Text style={styles.meaning}>{word.meaning}</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={strings.keepPlaying}
            onPress={onClose}
            style={({ pressed }) => [styles.nextBtn, pressed && styles.nextBtnPressed]}
          >
            <Text style={styles.nextBtnText}>{nextLabel}</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  hero: { alignItems: 'center', marginTop: 40, zIndex: 3 },
  bannerWrap: { marginTop: -8 },
  card: {
    marginTop: 12,
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 26,
    padding: 22,
    paddingTop: 30,
    alignItems: 'center',
    shadowColor: '#1e1b4b',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 10
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    minHeight: 40
  },
  word: { color: '#2ea44f', fontSize: 30, fontWeight: '900', letterSpacing: 2 },
  speakerBtn: {
    position: 'absolute',
    right: 0,
    width: 42,
    height: 42,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.94 }] },
  character: { marginVertical: 8 },
  emojiFrame: {
    width: 160,
    height: 160,
    borderRadius: radii.pill,
    backgroundColor: '#fff5db',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emojiText: { fontSize: 84 },
  meaning: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 10,
    lineHeight: 21
  },
  nextBtn: {
    alignSelf: 'stretch',
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: radii.pill,
    backgroundColor: '#3ea41f',
    alignItems: 'center'
  },
  nextBtnPressed: { transform: [{ translateY: 2 }] },
  nextBtnText: { color: '#fff', fontWeight: '900', fontSize: 17 }
});

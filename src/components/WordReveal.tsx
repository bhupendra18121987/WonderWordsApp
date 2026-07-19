import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import AnimatedScene from './AnimatedScene';
import { letterBreakdown } from '../core/letters';
import { getScene } from '../core/scenes';
import { t } from '../core/i18n';
import type { Language } from '../core/types';

interface RevealItem {
  word: string;
  emoji: string;
  meaning: string;
  category?: string;
}

interface WordRevealProps {
  word: RevealItem | null;
  language?: Language;
  onClose: () => void;
}

export default function WordReveal({ word, language = 'en', onClose }: WordRevealProps) {
  const strings = t(language);
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!word) return;
    bounce.setValue(0);
    Animated.timing(bounce, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.back(1.5)),
      useNativeDriver: true
    }).start();
  }, [word, bounce]);

  if (!word) return null;
  const scene = getScene({ word: word.word, category: word.category });

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modal,
            {
              transform: [
                { scale: bounce.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }
              ],
              opacity: bounce
            }
          ]}
        >
          <AnimatedScene emoji={word.emoji} scene={scene} />
          <Text style={styles.word}>{word.word}</Text>
          <Text style={styles.breakdown}>{letterBreakdown(word.word, language)}</Text>
          <Text style={styles.meaning}>{word.meaning}</Text>
          <Pressable style={styles.btn} onPress={onClose}>
            <Text style={styles.btnText}>{strings.keepPlaying}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(30,20,55,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 22,
    alignItems: 'center',
    gap: 12,
    maxWidth: 480,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8
  },
  word: { fontSize: 30, fontWeight: '800', color: '#e26a89' },
  breakdown: { fontSize: 13, color: '#55556d', fontWeight: '700' },
  meaning: {
    fontSize: 16,
    color: '#55556d',
    textAlign: 'center',
    lineHeight: 22
  },
  btn: {
    marginTop: 8,
    backgroundColor: '#ff8fab',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999
  },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 16 }
});

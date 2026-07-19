import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radii } from '../core/theme';
import {
  MusicNoteIcon,
  PlayArrowIcon,
  SplashBackdrop,
  SplashPanda
} from './SplashAssets';

interface SplashScreenProps {
  onStart: () => void;
  ready?: boolean;
  onOpenParents?: () => void;
  onToggleSound?: () => void;
}

/**
 * Illustrated splash screen. Full-scene backdrop with sky, rainbow, hills,
 * house, panda mascot in a purple hoodie, and two CTAs.
 */
export default function SplashScreen({ onStart, ready = true, onOpenParents, onToggleSound }: SplashScreenProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const mascotY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(mascotY, { toValue: -8, duration: 1400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(mascotY, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
      ])
    ).start();
  }, [mascotY]);

  return (
    <View style={styles.screen}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <SplashBackdrop width={width} height={height} />
      </View>

      {onToggleSound ? (
        <Pressable
          onPress={onToggleSound}
          accessibilityRole="button"
          accessibilityLabel="Toggle music"
          style={({ pressed }) => [
            styles.musicBtn,
            { top: insets.top + 16 },
            pressed && styles.pressed
          ]}
        >
          <MusicNoteIcon size={20} />
        </Pressable>
      ) : null}

      <View style={[styles.titleWrap, { marginTop: insets.top + 40 }]}>
        <Text style={styles.title}>WonderWords</Text>
        <Text style={styles.tagline}>Learn Words. Discover Worlds.</Text>
      </View>

      <Animated.View style={[styles.mascot, { transform: [{ translateY: mascotY }] }]}>
        <SplashPanda size={Math.min(240, width * 0.55)} />
      </Animated.View>

      <View style={[styles.actions, { paddingBottom: Math.max(24, insets.bottom + 24) }]}>
        <Pressable
          disabled={!ready}
          onPress={onStart}
          accessibilityRole="button"
          accessibilityLabel="Let's Play"
          style={({ pressed }) => [
            styles.playBtn,
            !ready && styles.playBtnDisabled,
            pressed && styles.playBtnPressed
          ]}
        >
          <Text style={styles.playText}>Let's Play</Text>
          <View style={styles.playArrow}>
            <PlayArrowIcon size={14} />
          </View>
        </Pressable>

        {onOpenParents ? (
          <Pressable
            onPress={onOpenParents}
            accessibilityRole="button"
            accessibilityLabel="For Parents"
            style={({ pressed }) => [styles.parentsBtn, pressed && styles.parentsBtnPressed]}
          >
            <Text style={styles.parentsText}>For Parents</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#8ed6ff' },
  musicBtn: {
    position: 'absolute',
    right: 18,
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    shadowColor: '#4c1d95',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6
  },
  titleWrap: { alignItems: 'center', paddingHorizontal: 20, zIndex: 2 },
  title: {
    color: '#ffd23c',
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: 0.5,
    textShadowColor: '#4a1eae',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0
  },
  tagline: {
    marginTop: 6,
    color: '#1e1b4b',
    fontSize: 14,
    fontWeight: '800'
  },
  mascot: { alignItems: 'center', marginTop: 8, zIndex: 3 },
  actions: {
    marginTop: 'auto',
    paddingHorizontal: 24,
    gap: 10,
    zIndex: 3
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: radii.pill,
    backgroundColor: '#f5a91e',
    shadowColor: '#c67b0e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6
  },
  playBtnDisabled: { opacity: 0.6 },
  playBtnPressed: { transform: [{ translateY: 3 }] },
  playText: { color: colors.ink, fontSize: 18, fontWeight: '900' },
  playArrow: {
    width: 22,
    height: 22,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  parentsBtn: {
    paddingVertical: 12,
    borderRadius: radii.pill,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#1e1b4b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4
  },
  parentsBtnPressed: { transform: [{ translateY: 1 }] },
  parentsText: { color: colors.ink, fontSize: 16, fontWeight: '800' },
  pressed: { opacity: 0.85, transform: [{ scale: 0.94 }] }
});

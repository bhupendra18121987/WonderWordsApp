import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SplashScreenProps {
  onStart: () => void;
  /** When false, the Start button is disabled (waiting for AsyncStorage). */
  ready?: boolean;
}

/**
 * Full-screen splash. First tap also serves as the audio-unlock gesture
 * for `expo-speech` on iOS (Android is more permissive but harmless).
 */
export default function SplashScreen({ onStart, ready = true }: SplashScreenProps) {
  const mascotY = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Bouncing owl mascot
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(mascotY, { toValue: -14, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(mascotY, { toValue: 0,   duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
      ])
    ).start();
  }, [mascotY]);

  // Pulsing Start button
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonScale, { toValue: 1.06, duration: 800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(buttonScale, { toValue: 1,    duration: 800, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
      ])
    ).start();
  }, [buttonScale]);

  return (
    <LinearGradient
      colors={['#fff7d6', '#ffe6f2']}
      style={styles.container}
    >
      <Animated.Text
        style={[styles.mascot, { transform: [{ translateY: mascotY }] }]}
        accessibilityElementsHidden
      >
        🦉
      </Animated.Text>

      <Text style={styles.title}>WonderWords</Text>
      <Text style={styles.tagline}>Learn words the fun way!</Text>
      <Text style={styles.taglineHi}>शब्दों की जादुई दुनिया</Text>

      <Animated.View style={{ transform: [{ scale: buttonScale }], opacity: ready ? 1 : 0.5 }}>
        <Pressable
          style={styles.startBtn}
          onPress={onStart}
          disabled={!ready}
          accessibilityRole="button"
          accessibilityLabel="Tap to start"
        >
          <Text style={styles.startBtnText}>🎈  Tap to start · शुरू करें</Text>
        </Pressable>
      </Animated.View>

      {/* Corner sparkles for atmosphere */}
      <View pointerEvents="none" style={styles.sparklesLayer}>
        <Text style={[styles.sparkle, { top: '18%', left: '14%' }]}>✨</Text>
        <Text style={[styles.sparkle, { top: '22%', right: '18%' }]}>⭐</Text>
        <Text style={[styles.sparkle, { bottom: '28%', left: '20%' }]}>🎈</Text>
        <Text style={[styles.sparkle, { bottom: '24%', right: '16%' }]}>🌟</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12
  },
  mascot: {
    fontSize: 96,
    marginBottom: 4
  },
  title: {
    fontSize: 44,
    fontWeight: '800',
    color: '#e26a89',
    letterSpacing: 0.5
  },
  tagline: {
    fontSize: 16,
    color: '#55556d',
    fontWeight: '700',
    marginTop: 4
  },
  taglineHi: {
    fontSize: 15,
    color: '#e26a89',
    fontWeight: '700',
    marginBottom: 12
  },
  startBtn: {
    backgroundColor: '#ff8fab',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 999,
    shadowColor: '#ff8fab',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6
  },
  startBtnText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff'
  },
  sparklesLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  sparkle: {
    position: 'absolute',
    fontSize: 20
  }
});

import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

interface MascotProps {
  face?: string;
  message?: string;
}

/**
 * Floating owl mascot with an optional speech bubble. Sits fixed
 * bottom-right, above the bottom-nav.
 */
export default function Mascot({ face = '🦉', message }: MascotProps) {
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        })
      ])
    ).start();
  }, [bounce]);

  return (
    <View style={styles.mascot} pointerEvents="none">
      {message ? (
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{message}</Text>
        </View>
      ) : null}
      <Animated.Text
        style={[
          styles.face,
          {
            transform: [
              {
                translateY: bounce.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -6]
                })
              }
            ]
          }
        ]}
      >
        {face}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mascot: {
    position: 'absolute',
    right: 12,
    bottom: 96,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    zIndex: 30
  },
  bubble: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    maxWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3
  },
  bubbleText: { fontSize: 13, fontWeight: '700', color: '#2b2b3d' },
  face: {
    fontSize: 44,
    lineHeight: 52
  }
});

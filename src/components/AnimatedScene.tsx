import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import type { SceneDescriptor, SceneKey } from '../core/scenes';

interface AnimatedSceneProps {
  emoji: string;
  scene: SceneDescriptor;
}

// Per-scene background tint (simplified from web's SVG scenery).
const SCENE_TINTS: Record<SceneKey, [string, string]> = {
  road:            ['#b6ecff', '#d5c397'],
  'sky-flying':    ['#a1e4ff', '#ffffff'],
  water:           ['#a1e4ff', '#4aa8dc'],
  ground:          ['#b6ecff', '#91cd7c'],
  'weather-rain':  ['#9dbfd7', '#e7f0f7'],
  'weather-snow':  ['#cddaea', '#ffffff'],
  rainbow:         ['#cdeaff', '#ffffff'],
  celestial:       ['#1e1b4b', '#7b6fd0'],
  sparkles:        ['#fff3b0', '#c8e7ff']
};

/**
 * Simplified React Native version of the web AnimatedScene. Full SVG
 * scenery (roads, waves, hills, rainbows) is a bigger port; for now we
 * present the emoji large with a tinted gradient background and an
 * animation appropriate to the scene type. Full scenery can come later
 * via react-native-reanimated + custom drawings.
 */
export default function AnimatedScene({ emoji, scene }: AnimatedSceneProps) {
  const anim = useRef(new Animated.Value(0)).current;
  const [c1, c2] = SCENE_TINTS[scene.key] ?? SCENE_TINTS.sparkles;
  const dark = scene.key === 'celestial';

  useEffect(() => {
    // Pick the animation loop that matches the scene semantics.
    let cycle: Animated.CompositeAnimation;

    if (scene.key === 'road' || scene.key === 'sky-flying' || (scene.key === 'water' && scene.motion === 'bounce')) {
      // Cross the scene left to right
      cycle = Animated.loop(
        Animated.timing(anim, { toValue: 1, duration: 5000, easing: Easing.linear, useNativeDriver: true })
      );
    } else if (scene.motion === 'hop') {
      // Fast up-down bounces
      cycle = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 300, easing: Easing.in(Easing.quad), useNativeDriver: true })
        ])
      );
    } else if (scene.motion === 'spin') {
      cycle = Animated.loop(
        Animated.timing(anim, { toValue: 1, duration: 8000, easing: Easing.linear, useNativeDriver: true })
      );
    } else if (scene.motion === 'sway' || scene.key === 'ground') {
      cycle = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
        ])
      );
    } else {
      // Default: gentle bounce with sparkle feel
      cycle = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
        ])
      );
    }
    cycle.start();
    return () => {
      anim.stopAnimation();
      anim.setValue(0);
    };
  }, [scene.key, scene.motion, anim]);

  // Compute transform based on scene
  let transform: Animated.WithAnimatedArray<{ translateX?: number; translateY?: number; rotate?: string; scale?: number }> = [];
  const key = scene.key;
  const motion = scene.motion;

  if (key === 'road' || key === 'sky-flying') {
    transform = [
      { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [-160, 160] }) as unknown as number }
    ];
  } else if (key === 'water' && motion === 'bounce') {
    transform = [
      { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [-140, 140] }) as unknown as number },
      { rotate: anim.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: ['-4deg', '4deg', '-3deg', '3deg', '-4deg'] }) as unknown as string }
    ];
  } else if (key === 'water') {
    transform = [
      { translateX: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [-40, 40, -40] }) as unknown as number }
    ];
  } else if (motion === 'hop') {
    transform = [
      { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -28] }) as unknown as number },
      { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] }) as unknown as number }
    ];
  } else if (motion === 'sway') {
    transform = [
      { rotate: anim.interpolate({ inputRange: [0, 1], outputRange: ['-6deg', '6deg'] }) as unknown as string }
    ];
  } else if (motion === 'spin') {
    transform = [
      { rotate: anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) as unknown as string }
    ];
  } else {
    // Default bounce
    transform = [
      { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -14] }) as unknown as number },
      { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) as unknown as number }
    ];
  }

  return (
    <View style={[styles.scene, { backgroundColor: c1, borderColor: dark ? '#3d3070' : 'transparent' }]}>
      <View style={[styles.gradient, { backgroundColor: c2 }]} />
      {key === 'sparkles' && (
        <>
          <Text style={[styles.sparkle, { top: '12%', left: '12%' }]}>✨</Text>
          <Text style={[styles.sparkle, { top: '16%', right: '14%' }]}>⭐</Text>
          <Text style={[styles.sparkle, { bottom: '18%', left: '14%' }]}>🌟</Text>
          <Text style={[styles.sparkle, { bottom: '14%', right: '18%' }]}>💫</Text>
        </>
      )}
      {key === 'celestial' && (
        <>
          <Text style={[styles.sparkle, { top: '15%', left: '18%', color: '#fff' }]}>⭐</Text>
          <Text style={[styles.sparkle, { top: '25%', right: '20%', color: '#fff' }]}>✨</Text>
          <Text style={[styles.sparkle, { bottom: '25%', left: '25%', color: '#fff' }]}>💫</Text>
        </>
      )}
      <Animated.Text style={[styles.emoji, dark && { textShadowColor: '#fff', textShadowRadius: 6 }, { transform: transform as any }]}>
        {emoji}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    width: '100%',
    aspectRatio: 4 / 3,
    maxHeight: 260,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 2
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    opacity: 0.55
  },
  emoji: {
    fontSize: 96,
    lineHeight: 108,
    zIndex: 3
  },
  sparkle: {
    position: 'absolute',
    fontSize: 22,
    zIndex: 2
  }
});

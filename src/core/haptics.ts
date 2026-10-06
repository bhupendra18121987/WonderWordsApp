import { Platform, Vibration } from 'react-native';

export type HapticType = 'tap' | 'match' | 'miss' | 'celebrate';

/**
 * Lightweight, safe haptic feedback powered by React Native's built-in Vibration API.
 * Provides subtle tactile feedback on mobile devices without external binary dependencies.
 */
export function triggerHaptic(type: HapticType = 'tap'): void {
  if (Platform.OS !== 'android') return;
  try {
    switch (type) {
      case 'tap':
        // Crisp, ultra-short tactile click
        Vibration.vibrate(14);
        break;
      case 'match':
        // Cheerful double-tap: buzz, pause, buzz
        Vibration.vibrate([0, 20, 50, 30]);
        break;
      case 'miss':
        // Gentle soft buzz
        Vibration.vibrate(30);
        break;
      case 'celebrate':
        // Celebration pattern
        Vibration.vibrate([0, 30, 60, 30, 60, 45]);
        break;
    }
  } catch {
    // Vibration silently skipped if device disables vibration or permissions
  }
}

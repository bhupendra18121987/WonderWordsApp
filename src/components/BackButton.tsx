import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radii } from '../core/theme';

interface BackButtonProps {
  onPress: () => void;
  variant?: 'light' | 'dark';
  label?: string;
}

/**
 * Small circular back button used on secondary/themed screens.
 * `light` = translucent white on purple. `dark` = white on light.
 */
export default function BackButton({ onPress, variant = 'light', label = 'Back' }: BackButtonProps) {
  const isLight = variant === 'light';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.fab,
        isLight ? styles.fabLight : styles.fabDark,
        pressed && styles.pressed
      ]}
    >
      <Svg width={20} height={20} viewBox="0 0 24 24">
        <Path
          d="M14 6 L8 12 L14 18 M8 12 L20 12"
          stroke={isLight ? '#fff' : colors.ink}
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
      {/* hidden label for accessibility */}
      <View style={{ width: 0, height: 0 }}>
        <Text>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    width: 42,
    height: 42,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fabLight: { backgroundColor: 'rgba(255,255,255,0.22)' },
  fabDark: {
    backgroundColor: '#fff',
    shadowColor: '#1e1b4b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3
  },
  pressed: { transform: [{ scale: 0.94 }] }
});

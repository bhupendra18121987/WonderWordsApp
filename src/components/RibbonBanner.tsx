import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors, radii, shadow } from '../core/theme';

interface RibbonBannerProps {
  title: string;
  /** Small emoji shown "hanging" off the top center. */
  topGarnish?: string;
  style?: ViewStyle | ViewStyle[];
}

/**
 * Purple ribbon-banner used to head major screens
 * (age select, rewards, celebration). Looks like a ribbon or scroll
 * with a small hanging garnish (star, gift, etc.) on top.
 */
export default function RibbonBanner({ title, topGarnish, style }: RibbonBannerProps) {
  return (
    <View style={[styles.wrap, style]}>
      {topGarnish && <Text style={styles.garnish}>{topGarnish}</Text>}
      <View style={styles.ribbon}>
        {/* Left "fold" */}
        <View style={[styles.notch, styles.notchLeft]} />
        <Text style={styles.title}>{title}</Text>
        {/* Right "fold" */}
        <View style={[styles.notch, styles.notchRight]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
    position: 'relative'
  },
  garnish: {
    fontSize: 22,
    marginBottom: -12,
    zIndex: 2
  },
  ribbon: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: radii.pill,
    ...shadow.card,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: colors.onPrimary,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  notch: {
    position: 'absolute',
    top: '55%',
    width: 14,
    height: 14,
    backgroundColor: colors.primaryDark,
    transform: [{ rotate: '45deg' }],
    zIndex: -1
  },
  notchLeft:  { left: -6 },
  notchRight: { right: -6 }
});

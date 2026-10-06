import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from './BackButton';
import { t } from '../core/i18n';
import type { Language } from '../core/types';
import { colors, radii, shadow } from '../core/theme';

interface ThemedScreenProps {
  title: string;
  titleIcon?: ReactNode;
  onBack?: () => void;
  headerRight?: ReactNode;
  children: ReactNode;
  /** When true, wraps content in a ScrollView. Default: true. */
  scroll?: boolean;
  /** Extra bottom padding for content so BottomNav doesn't cover it. */
  contentBottomPadding?: number;
  language?: Language;
}

/**
 * Mobile shell used by the themed inner screens (mini games, alphabet,
 * mini-games hub, rewards, profile). Matches the web `ThemedScreen`:
 * teal storybook header, back button + title bar, and warm paper content card.
 */
export default function ThemedScreen({
  title,
  titleIcon,
  onBack,
  headerRight,
  children,
  scroll = true,
  contentBottomPadding = 120,
  language = 'en'
}: ThemedScreenProps) {
  const insets = useSafeAreaInsets();
  const strings = t(language);

  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.screen, { paddingTop: insets.top + 12 }]}
    >
      <View style={styles.topbar}>
        <View style={styles.side}>
          {onBack ? <BackButton onPress={onBack} variant="light" label={strings.back} /> : null}
        </View>
        <View style={styles.titleWrap}>
          {titleIcon}
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </View>
        <View style={[styles.side, styles.sideRight, headerRight ? styles.headerRightPill : null]}>{headerRight}</View>
      </View>

      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.card, { paddingBottom: contentBottomPadding + insets.bottom }]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.card, styles.cardNoScroll, { paddingBottom: contentBottomPadding + insets.bottom }]}>
          {children}
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 16, alignItems: 'center' },
  scroll: { width: '100%', maxWidth: 760, alignSelf: 'center' },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8
  },
  side: { minWidth: 44, alignItems: 'flex-start' },
  sideRight: { alignItems: 'flex-end' },
  headerRightPill: { minWidth: 0, paddingHorizontal: 10, paddingVertical: 7, borderRadius: radii.pill, backgroundColor: 'rgba(255,255,255,0.94)', ...shadow.soft },
  titleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  title: {
    color: '#fffefa',
    fontSize: 20,
    fontWeight: '900',
    textShadowColor: 'rgba(30,15,110,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0,
    textAlign: 'center'
  },
  card: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    backgroundColor: colors.paper,
    borderRadius: radii.lg,
    padding: 16,
    gap: 12,
    ...shadow.card
  },
  cardNoScroll: { flex: 1 }
});

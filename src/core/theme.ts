// Shared design tokens for the WonderWords mobile app.
// Shared "storybook garden" palette: teal, warm cream, and sunny yellow.

export const colors = {
  // Primary — storybook teal, used for buttons, banners, and headers.
  primary: '#147d78',
  primaryDark: '#0c615d',
  primaryLight: '#66c3b7',
  primarySoft: '#def3ee',

  // Accents.
  accent: '#fbbf24',        // yellow-400 — CTA / stars
  accentDark: '#f59e0b',    // yellow-500
  accentSoft: '#fef3c7',    // yellow-100
  coin: '#fcd34d',          // slightly deeper for coin chips

  // Semantic.
  success: '#10b981',
  danger: '#ef4b6b',
  info: '#38bdf8',

  // Surfaces.
  bg: '#f7f6eb',            // warm storybook cream
  bgSoft: '#fffdf5',
  paper: '#fffefa',
  border: '#d9e8df',

  // Text.
  ink: '#183b42',
  inkSoft: '#557176',
  inkMuted: '#82989a',
  onPrimary: '#ffffff',     // text sitting on primary color
  onAccent: '#183b42',      // dark text on yellow

  // Palette used for age-select / animal tiles + word-search cells.
  tileGreen: '#a7f3d0',
  tileYellow: '#fde68a',
  tileBlue: '#bfdbfe',
  tilePink: '#fbcfe8',
  tilePurple: '#ddd6fe',
  tileOrange: '#fed7aa'
} as const;

export const radii = {
  xs: 8,
  sm: 14,
  md: 20,
  lg: 28,
  pill: 999
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32
} as const;

export const shadow = {
  // Soft green-tinted shadows fit the garden palette.
  soft: {
    shadowColor: '#174d4c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3
  },
  card: {
    shadowColor: '#174d4c',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6
  },
  cta: {
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6
  }
} as const;

export const typography = {
  h1: { fontSize: 30, fontWeight: '900' as const, color: colors.ink },
  h2: { fontSize: 22, fontWeight: '900' as const, color: colors.ink },
  h3: { fontSize: 17, fontWeight: '800' as const, color: colors.ink },
  body: { fontSize: 15, fontWeight: '600' as const, color: colors.ink },
  small: { fontSize: 12, fontWeight: '700' as const, color: colors.inkSoft }
} as const;

export const Colors = {
  primary: '#4CAF7D',
  background: '#FAFAF7',
  card: '#FFFFFF',
  textDark: '#1A2B1E',
  textMuted: '#6B7E71',
  danger: '#FF6B6B',
  border: '#E8EDE9',

  // Category pastels
  pastelGreen: '#C8F0D8',
  pastelPeach: '#FFE4CC',
  pastelLavender: '#E8DAFF',
  pastelSky: '#CCE9FF',
  pastelYellow: '#FFF3CC',

  // Gamification
  xpGold: '#F4B942',
  xpTrack: '#E8EDE9',
  locked: '#C5CEC7',
  bossNode: '#FF6B6B',

  // Gradient stops for net worth card
  gradientStart: '#4CAF7D',
  gradientEnd: '#2D8653',
};

export const Fonts = {
  regular: 'System',
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    hero: 36,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const Shadow = {
  card: {
    shadowColor: '#1A2B1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  strong: {
    shadowColor: '#1A2B1E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
};

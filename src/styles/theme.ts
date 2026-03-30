const amber = '#FFD60A' as const
const tealHex = '#64D2FF' as const
const red = '#FF453A' as const
const green = '#30D158' as const

export const colors = {
  // Background
  bgBase: '#0a1a12',
  bgElevated: '#0f2519',

  // Liquid Glass surfaces
  glass: 'rgba(255, 255, 255, 0.08)',
  glassHover: 'rgba(255, 255, 255, 0.12)',
  glassActive: 'rgba(255, 255, 255, 0.16)',
  glassProminent: 'rgba(255, 255, 255, 0.10)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  glassBorderLight: 'rgba(255, 255, 255, 0.15)',
  glassStrong: 'rgba(255, 255, 255, 0.16)',

  // Refraction
  refractionTop: 'rgba(255, 255, 255, 0.25)',
  refractionSide: 'rgba(255, 255, 255, 0.08)',
  refractionBottom: 'rgba(0, 0, 0, 0.15)',

  // Room card tints — subtle, let background bleed through
  roomWarmGold: 'rgba(255, 214, 10, 0.08)',
  roomCoolBlue: 'rgba(100, 210, 255, 0.08)',
  roomNeutralGray: 'rgba(255, 255, 255, 0.04)',

  // Text
  textPrimary: 'rgba(255, 255, 255, 0.95)',
  textSecondary: 'rgba(255, 255, 255, 0.55)',
  textMuted: 'rgba(255, 255, 255, 0.35)',

  // Accents — Apple system colors
  amber,
  amberSoft: 'rgba(255, 214, 10, 0.15)',
  amberGlow: 'rgba(255, 214, 10, 0.25)',
  teal: tealHex,
  tealSoft: 'rgba(100, 210, 255, 0.12)',

  // Status
  statusOn: amber,
  statusOff: 'rgba(255, 255, 255, 0.06)',
  statusAlert: red,
  statusAlertSoft: 'rgba(255, 69, 58, 0.12)',
  statusGood: green,
  statusGoodSoft: 'rgba(48, 209, 88, 0.12)',

  // Energy
  solarYellow: amber,
  gridImport: red,
  gridExport: '#BF5AF2',
  phaseA: red,
  phaseB: '#0A84FF',
  phaseC: green,

  // Sidebar
  sidebarBg: 'rgba(10, 26, 18, 0.75)',
  sidebarActive: 'rgba(255, 255, 255, 0.08)',

  // Accent aliases for component use
  accentAmber: amber,
  accentGreen: green,
  accentBlue: tealHex,
  accentRed: red,
} as const

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
} as const

export const borderRadius = {
  sm: '10px',
  md: '14px',
  lg: '22px',
  xl: '28px',
  full: '9999px',
} as const

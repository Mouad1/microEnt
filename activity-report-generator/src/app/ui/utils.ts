// UI Utilities and Helper Functions

/**
 * Common CSS class utilities that can be used across components
 */
export const UI_CLASSES = {
  // Common transitions
  transition: {
    default: 'transition-all duration-200 ease-in-out',
    fast: 'transition-all duration-150 ease-in-out',
    slow: 'transition-all duration-300 ease-in-out',
  },

  // Focus styles
  focus: {
    ring: 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
    ringDanger:
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
    ringSuccess:
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500',
  },

  // Shadow utilities
  shadow: {
    soft: 'shadow-soft',
    protocol: 'shadow-protocol',
    protocolLg: 'shadow-protocol-lg',
    glow: 'shadow-glow',
    glowLg: 'shadow-glow-lg',
    glowPurple: 'shadow-glow-purple',
    glowPurpleLg: 'shadow-glow-purple-lg',
  },

  // Animation utilities
  animation: {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    slideDown: 'animate-slide-down',
    scaleIn: 'animate-scale-in',
  },

  // Common layouts
  layout: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    containerSm: 'max-w-3xl mx-auto px-4 sm:px-6 lg:px-8',
    containerMd: 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8',
    flexCenter: 'flex items-center justify-center',
    flexBetween: 'flex items-center justify-between',
  },

  // Typography utilities
  typography: {
    heading: 'font-bold tracking-tight',
    subheading: 'font-semibold',
    body: 'font-normal leading-relaxed',
    caption: 'text-sm text-slate-600',
  },
} as const;

/**
 * Color palette utilities for consistent theming
 */
export const UI_COLORS = {
  primary: {
    50: 'bg-indigo-50 text-indigo-900',
    100: 'bg-indigo-100 text-indigo-900',
    500: 'bg-indigo-500 text-white',
    600: 'bg-indigo-600 text-white',
    700: 'bg-indigo-700 text-white',
  },
  secondary: {
    50: 'bg-slate-50 text-slate-900',
    100: 'bg-slate-100 text-slate-900',
    500: 'bg-slate-500 text-white',
    600: 'bg-slate-600 text-white',
    700: 'bg-slate-700 text-white',
  },
  accent: {
    50: 'bg-purple-50 text-purple-900',
    100: 'bg-purple-100 text-purple-900',
    500: 'bg-purple-500 text-white',
    600: 'bg-purple-600 text-white',
    700: 'bg-purple-700 text-white',
  },
  success: {
    50: 'bg-emerald-50 text-emerald-900',
    100: 'bg-emerald-100 text-emerald-900',
    500: 'bg-emerald-500 text-white',
    600: 'bg-emerald-600 text-white',
  },
  warning: {
    50: 'bg-amber-50 text-amber-900',
    100: 'bg-amber-100 text-amber-900',
    500: 'bg-amber-500 text-white',
    600: 'bg-amber-600 text-white',
  },
  danger: {
    50: 'bg-red-50 text-red-900',
    100: 'bg-red-100 text-red-900',
    500: 'bg-red-500 text-white',
    600: 'bg-red-600 text-white',
  },
} as const;

/**
 * Utility function to combine classes
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Utility function to generate responsive classes
 */
export function responsive(classes: {
  default?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
}): string {
  const result: string[] = [];

  if (classes.default) result.push(classes.default);
  if (classes.sm) result.push(`sm:${classes.sm}`);
  if (classes.md) result.push(`md:${classes.md}`);
  if (classes.lg) result.push(`lg:${classes.lg}`);
  if (classes.xl) result.push(`xl:${classes.xl}`);

  return result.join(' ');
}

/**
 * Utility function for generating consistent spacing
 */
export const SPACING = {
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
  '2xl': 'p-12',
} as const;

/**
 * Utility function for generating consistent border radius
 */
export const BORDER_RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
} as const;

export const READING_SPEED = 200;
export const SCROLL_THRESHOLD = 50;
export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 968,
  wide: 1200,
} as const;
export const ANIMATION_DURATION = {
  fast: '0.15s',
  normal: '0.3s',
  slow: '0.45s',
} as const;
export const EASING = {
  default: 'ease',
  smooth: 'cubic-bezier(.2,.8,.2,1)',
} as const;

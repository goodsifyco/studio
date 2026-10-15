import confetti from 'canvas-confetti';

/**
 * Editorial brand palette confetti suited for Goodsify Development
 * (Warm beige, electric blue, dark onyx, subtle gold)
 */
const BRAND_COLORS = [
  '#1D4ED8', // Electric blue
  '#3B82F6', // Blue
  '#93C5FD', // Soft blue
  '#111110', // Dark onyx
  '#D8D4CA', // Warm champagne beige
  '#F59E0B'  // Subtle amber gold
];

/**
 * Fires a subtle, non-intrusive celebratory confetti burst tailored for toast entrance
 */
export const fireToastConfetti = (originX = 0.85, originY = 0.88) => {
  // Check if prefers-reduced-motion is enabled
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  try {
    // Primary subtle fountain
    confetti({
      particleCount: 45,
      spread: 55,
      startVelocity: 30,
      origin: { x: originX, y: originY },
      colors: BRAND_COLORS,
      ticks: 180,
      gravity: 0.9,
      decay: 0.92,
      scalar: 0.85,
      shapes: ['circle', 'square'],
      disableForReducedMotion: true,
      zIndex: 9999
    });

    // Secondary micro-sparkle delayed slightly for depth
    setTimeout(() => {
      confetti({
        particleCount: 25,
        spread: 40,
        startVelocity: 22,
        origin: { x: originX, y: originY },
        colors: ['#1D4ED8', '#60A5FA', '#FBBF24', '#FFFFFF'],
        ticks: 140,
        gravity: 1.1,
        decay: 0.93,
        scalar: 0.65,
        shapes: ['circle'],
        disableForReducedMotion: true,
        zIndex: 9999
      });
    }, 120);
  } catch {
    // Graceful fallback if canvas is restricted
  }
};

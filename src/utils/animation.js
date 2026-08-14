// Shared Framer Motion presets for a consistent "premium" feel.

export const EASE = [0.16, 1, 0.3, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: EASE },
  }),
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.8, delay, ease: EASE },
  }),
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -32 },
  show: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, delay, ease: EASE },
  }),
};

export const fadeRight = {
  hidden: { opacity: 0, x: 32 },
  show: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, delay, ease: EASE },
  }),
};

export const staggerContainer = (stagger = 0.1, delayChildren = 0.1) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

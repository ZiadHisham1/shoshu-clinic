import type { MotionProps, Variants } from "motion/react";

const easeOutQuint: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const viewportOnce = { once: true, amount: 0.3 } as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: easeOutQuint } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutQuint } },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const wordStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export const wordReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutQuint } },
};

// Delayed so the CTA lands after the headline finishes staggering.
export const ctaReveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutQuint, delay: 0.9 },
  },
};

export const stickyReveal: Variants = {
  hidden: { opacity: 0, y: 48 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutQuint, delay: 0.6 },
  },
};

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutQuint } },
};

export const scaleOnTap: MotionProps = {
  whileTap: { scale: 0.97 },
  transition: { duration: 0.15, ease: "easeOut" },
};

export const floatLoop: MotionProps = {
  animate: { y: [0, -16, 0] },
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
};

/* ============================================================
   Booking page motion tokens
   ============================================================ */

export const slotReveal: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 8 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.28, ease: easeOutQuint },
  },
};

export const slotGrid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
};

export const summaryReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOutQuint },
  },
  exit: { opacity: 0, y: 24, transition: { duration: 0.2 } },
};

export const stepFade: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: easeOutQuint } },
  exit: { opacity: 0, x: -24, transition: { duration: 0.2 } },
};
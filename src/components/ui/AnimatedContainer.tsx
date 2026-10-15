"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { fadeIn, fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";

interface Props {
  children: ReactNode;
  className?: string;
}

export const AnimatedContainer = ({ children, className }: Props) => (
  <motion.div
    className={className}
    variants={staggerContainer}
    initial="hidden"
    whileInView="show"
    viewport={viewportOnce}
  >
    {children}
  </motion.div>
);

// Inherits the "show" state from the nearest motion parent, so stagger works for free.
export const AnimatedItem = ({ children, className }: Props) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div className={className} variants={reduceMotion ? fadeIn : fadeInUp}>
      {children}
    </motion.div>
  );
};

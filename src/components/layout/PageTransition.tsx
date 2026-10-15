"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { fadeIn, pageTransition } from "@/lib/motion";

interface Props {
  children: ReactNode;
  className?: string;
}

const PageTransition = ({ children, className }: Props) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.main
      id="main"
      className={className}
      variants={reduceMotion ? fadeIn : pageTransition}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.main>
  );
};

export default PageTransition;

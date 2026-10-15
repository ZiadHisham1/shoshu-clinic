"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { copy, siteConfig } from "@/lib/constants";
import { fadeIn, stickyReveal } from "@/lib/motion";
import { ButtonLink } from "@/components/ui/Button";

const StickyCTA = () => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      variants={reduceMotion ? fadeIn : stickyReveal}
      initial="hidden"
      animate="show"
      className="fixed inset-x-0 bottom-0 z-50 bg-transparent p-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      <div className="mx-auto max-w-[720px]">
        <ButtonLink href={siteConfig.bookingUrl} size="lg" className="w-full shadow-lifted">
          {copy.bookNow}
          {/* Arrow points left because forward is left in RTL. */}
          <ArrowLeft className="size-5" aria-hidden />
        </ButtonLink>
      </div>
    </motion.div>
  );
};

export default StickyCTA;

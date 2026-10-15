"use client";

import { motion, useReducedMotion } from "motion/react";
import { summaryReveal } from "@/lib/motion";
import type { Service, Slot } from "./BookingFlow";

export function BookingSummary({
  service,
  slot,
}: {
  service: Service;
  slot: Slot;
}) {
  const reduceMotion = useReducedMotion();
  const start = new Date(slot.start_at);

  return (
    <motion.div
      variants={reduceMotion ? undefined : summaryReveal}
      initial="hidden"
      animate="show"
      exit="exit"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-white/95 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="truncate font-tajawal text-sm font-bold text-figma-text">
            {service.name}
          </p>
          <p className="truncate font-tajawal text-xs text-figma-textMut">
            {start.toLocaleDateString("ar-EG", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
            {" • "}
            {start.toLocaleTimeString("ar-EG", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {service.price && (
          <p className="shrink-0 font-tajawal text-lg font-extrabold text-figma-text">
            {service.price.toLocaleString("ar-EG")} ج.م
          </p>
        )}
      </div>
    </motion.div>
  );
}
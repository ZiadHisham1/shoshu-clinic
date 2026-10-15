"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { serviceCategories } from "@/lib/constants";
import type { ServiceCategoryId } from "@/types";
import { cn } from "@/lib/utils";
import {
  AnimatedContainer,
  AnimatedItem,
} from "@/components/ui/AnimatedContainer";

const ServicesSection = () => {
  const [active, setActive] = useState<ServiceCategoryId>("slimming");
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const current =
    serviceCategories.find((c) => c.id === active) ?? serviceCategories[0];

  // The item shown in the featured panel: hovered/clicked item OR the first one
  const featuredItem =
    current.items.find((i) => i.id === activeItemId) ?? current.items[0];

  return (
    <section id="services" className="relative w-full">
      {/* ═══════════ Tabs ═══════════ */}
      <AnimatedContainer>
        <AnimatedItem>
          <div className="w-full overflow-x-auto pb-1">
            <div className="flex gap-3 sm:gap-4">
              {serviceCategories.map((cat) => {
                const isActive = active === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setActive(cat.id);
                      setActiveItemId(null); // reset feature to first item
                    }}
                    className={cn(
                      "flex h-[42px] shrink-0 items-center justify-center rounded-[30px] px-5",
                      "font-tajawal text-base font-extrabold text-figma-text sm:text-lg",
                      isActive
                        ? "border border-white bg-figma-tabOn"
                        : "border border-black/50 bg-figma-tab"
                    )}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </AnimatedItem>
      </AnimatedContainer>

      {/* ═══════════ Featured panel + services list ═══════════ */}
      <AnimatedContainer>
        <AnimatedItem>
          <div className="mt-6 flex flex-col gap-4 sm:mt-8 lg:flex-row lg:gap-6">
            {/* ─── Featured panel (image + description) ─── */}
            <div className="relative w-full overflow-hidden rounded-[25px] border border-black/50 lg:w-[454px] lg:shrink-0">
              {/* Animated background */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={featuredItem.id}
                  initial={reduceMotion ? undefined : { opacity: 0 }}
                  animate={reduceMotion ? undefined : { opacity: 0.5 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  {/* Gradient base — always visible */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-50",
                      featuredItem.gradient
                    )}
                  />

                  {/* Optional image layer on top */}
                  {featuredItem.image && (
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-90 mix-blend-overlay"
                      style={{ backgroundImage: `url(${featuredItem.image})` }}
                      aria-hidden
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Content overlay */}
              <div className="relative flex min-h-[240px] flex-col justify-end p-5 sm:min-h-[280px] lg:min-h-[319px] lg:p-6">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={featuredItem.id}
                    initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-2"
                  >
                    <h3 className="font-tajawal text-lg font-extrabold text-figma-text sm:text-xl">
                      {featuredItem.title}
                    </h3>
                    <p className="font-tajawal text-xs leading-relaxed text-figma-text/80 sm:text-sm">
                      {featuredItem.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* ─── Services list ─── */}
            <div className="flex flex-1 flex-col gap-3 sm:gap-4">
              {current.items.map((item) => {
                const Icon = item.icon;
                const isFocused =
                  activeItemId === item.id ||
                  (activeItemId === null && item.id === current.items[0].id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveItemId(item.id)}
                    onMouseEnter={() => setActiveItemId(item.id)}
                    onFocus={() => setActiveItemId(item.id)}
                    aria-pressed={isFocused}
                    className={cn(
                      "flex items-center gap-3 rounded-[13px] border p-3 text-start transition",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-header sm:gap-4 sm:p-4",
                      isFocused
                        ? "border-figma-header bg-figma-tab shadow-[0_6px_20px_-10px_rgba(251,111,146,0.5)] ring-1 ring-figma-header/30"
                        : "border-black/50 bg-figma-tab hover:border-figma-header/60 hover:bg-figma-tabOn/60"
                    )}
                  >
                    <div className="flex h-[41px] w-[41px] shrink-0 items-center justify-center rounded-full bg-white">
                      <Icon className="h-5 w-5 text-figma-text" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="truncate font-tajawal text-base font-bold text-figma-text sm:text-lg">
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p className="truncate font-tajawal text-xs font-medium text-figma-text sm:text-sm">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </AnimatedItem>
      </AnimatedContainer>
    </section>
  );
};

export default ServicesSection;
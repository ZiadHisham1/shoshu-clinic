"use client";

import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { ar } from "date-fns/locale";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-day-picker/style.css";
import { cn } from "@/lib/utils";
import { slotGrid, slotReveal } from "@/lib/motion";
import type { Slot } from "./BookingFlow";

interface Props {
  slots: Slot[];
  selected: Slot | null;
  onSelect: (s: Slot) => void;
}

export function MonthSlotPicker({ slots, selected, onSelect }: Props) {
  const reduceMotion = useReducedMotion();

  /* ── Group slots by day ── */
  const byDate = useMemo(() => {
    const map = new Map<string, Slot[]>();
    slots.forEach((s) => {
      const key = s.start_at.slice(0, 10);
      const arr = map.get(key) ?? [];
      arr.push(s);
      map.set(key, arr);
    });
    map.forEach((arr) =>
      arr.sort((a, b) => a.start_at.localeCompare(b.start_at))
    );
    return map;
  }, [slots]);

  const availableDates = useMemo(
    () => Array.from(byDate.keys()).map((k) => new Date(`${k}T00:00:00`)),
    [byDate]
  );

  const availableSet = useMemo(
    () => new Set(availableDates.map((d) => toKey(d))),
    [availableDates]
  );

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const [pickedDate, setPickedDate] = useState<Date>(
    availableDates[0] ?? today
  );

  const pickedKey = toKey(pickedDate);
  const daySlots = byDate.get(pickedKey) ?? [];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* ═══════════ CALENDAR ═══════════ */}
      <div className="rounded-sm bg-white p-4 ring-1 ring-black/10 sm:p-6">
        <DayPicker
          mode="single"
          selected={pickedDate}
          onSelect={(d) => d && setPickedDate(d)}
          disabled={[{ before: today }, (day) => !availableSet.has(toKey(day))]}
          locale={ar}
          dir="rtl"
          showOutsideDays={false}
          captionLayout="dropdown"
          fromYear={today.getFullYear()}
          toYear={today.getFullYear() + 1}
          modifiers={{
            hasSlots: availableDates,
          }}
          modifiersClassNames={{
            hasSlots: "rdp-has-slots",
          }}
          classNames={{
            root: "rdp-root w-full",
            months: "w-full",
            month: "w-full space-y-4",
            month_caption:
              "flex items-center justify-between gap-2 pb-3 font-tajawal text-base text-figma-text",
            dropdowns: "flex items-center gap-2",
            caption_label: "hidden",
            nav: "flex items-center gap-1",
            button_previous:
              "grid h-8 w-8 place-items-center rounded-full text-figma-text transition hover:bg-figma-tab/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-header",
            button_next:
              "grid h-8 w-8 place-items-center rounded-full text-figma-text transition hover:bg-figma-tab/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-header",
            month_grid: "w-full border-collapse",
            weekdays: "text-figma-textMut",
            weekday:
              "pb-2 text-center font-tajawal text-[11px] font-medium uppercase tracking-wide",
            week: "mt-1",
            day: "p-0 text-center",
            day_button:
              "mx-auto grid h-10 w-10 place-items-center rounded-sm font-tajawal text-sm text-figma-text transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-header disabled:cursor-not-allowed",
            selected:
              "[&>button]:bg-figma-header [&>button]:font-bold [&>button]:text-white [&>button]:shadow-[0_6px_20px_-8px_rgba(251,111,146,0.6)]",
            today:
              "[&>button]:ring-2 [&>button]:ring-figma-header/40 [&>button]:font-bold",
            outside: "opacity-0",
            disabled: "[&>button]:text-figma-textMut/30 [&>button]:line-through",
          }}
          components={{
            Chevron: ({ orientation }) =>
              orientation === "left" ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              ),
          }}
        />

        <style jsx global>{`
          /* Has-slots modifier: small pink dot under the day */
          .rdp-has-slots > button::after {
            content: "";
            position: absolute;
            bottom: 4px;
            left: 50%;
            transform: translateX(-50%);
            width: 5px;
            height: 5px;
            border-radius: 9999px;
            background: #fb6f92;
            opacity: 0.8;
          }
          .rdp-has-slots > button {
            position: relative;
          }
          /* Dropdown styling */
          .rdp-root select {
            appearance: none;
            background: transparent;
            border: none;
            font-family: inherit;
            font-size: 0.95rem;
            color: #3f3f3f;
            font-weight: 600;
            padding: 2px 4px;
            cursor: pointer;
            outline: none;
          }
          .rdp-root select:hover {
            color: #fb6f92;
          }
        `}</style>
      </div>

      {/* ═══════════ SLOTS ═══════════ */}
      <section className="flex flex-col gap-4">
        <header className="flex items-baseline justify-between gap-3">
          <h3 className="font-tajawal text-base font-bold text-figma-text sm:text-lg">
            {pickedDate.toLocaleDateString("ar-EG", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h3>
          <span className="font-tajawal text-xs text-figma-textMut">
            {daySlots.length} موعد متاح
          </span>
        </header>

        {daySlots.length === 0 ? (
          <div className="grid flex-1 place-items-center rounded-2xl bg-white p-8 ring-1 ring-black/10">
            <p className="font-tajawal text-sm text-figma-textMut">
              لا توجد مواعيد متاحة في هذا اليوم
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={pickedKey}
              variants={reduceMotion ? undefined : slotGrid}
              initial="hidden"
              animate="show"
              exit="exit"
              className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4"
            >
              {daySlots.map((s) => {
                const t = new Date(s.start_at);
                const active = selected?.id === s.id;
                return (
                  <motion.button
                    key={s.id}
                    type="button"
                    variants={reduceMotion ? undefined : slotReveal}
                    onClick={() => onSelect(s)}
                    whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                    className={cn(
                      "flex h-11 items-center justify-center rounded-full font-tajawal text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-header",
                      active
                        ? "bg-figma-header font-bold text-white shadow-[0_6px_20px_-8px_rgba(251,111,146,0.6)]"
                        : "bg-white text-figma-text ring-1 ring-black/10 hover:bg-figma-tab/30 hover:ring-figma-header/40"
                    )}
                    aria-pressed={active}
                  >
                    {t.toLocaleTimeString("ar-EG", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </section>
    </div>
  );
}

function toKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
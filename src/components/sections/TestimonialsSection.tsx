"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  AnimatedContainer,
  AnimatedItem,
} from "@/components/ui/AnimatedContainer";

const TESTIMONIALS = [
  {
    name: "سارة أحمد",
    text: "هذا المكان رائع جدا، الخدمة ممتازة والنتائج واضحة منذ الجلسة الأولى.",
  },
  {
    name: "منى محمود",
    text: "الدكتورة شرحت كل حاجة بالتفصيل، والمكان نظيف ومريح. أنصح بيه بشدة.",
  },
  {
    name: "هبة علي",
    text: "حجامة احترافية واهتمام بالتفاصيل. حاسة بفرق كبير في الطاقة والصحة.",
  },
];

const TestimonialsSection = () => {
  const [index, setIndex] = useState(0);
  const total = TESTIMONIALS.length;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <section className="relative">
      <AnimatedContainer>
        <AnimatedItem>
          <div className="w-full rounded-[20px] border border-black/10 bg-figma-tab px-4 py-6 sm:px-6 sm:py-8">
            <h2 className="mb-5 font-tajawal text-2xl font-extrabold text-figma-text sm:mb-6 sm:text-3xl lg:text-[32px]">
              اراء العملاء
            </h2>

            {/* ─── Desktop / tablet: 3 columns ─── */}
            <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={i}
                  className="flex h-[220px] flex-col justify-between rounded-[20px] border border-black/10 bg-white p-5 sm:h-[260px] lg:h-[306px] lg:p-6"
                >
                  <p className="font-tajawal text-sm leading-relaxed text-figma-text sm:text-base">
                    {t.text}
                  </p>
                  <p className="mt-3 font-tajawal text-sm font-medium text-figma-text sm:text-base">
                    — {t.name}
                  </p>
                </div>
              ))}
            </div>

            {/* ─── Mobile: single card carousel ─── */}
            <div className="sm:hidden">
              <div className="flex h-[220px] flex-col justify-between rounded-[20px] border border-black/10 bg-white p-5">
                <p className="font-tajawal text-sm leading-relaxed text-figma-text">
                  {TESTIMONIALS[index].text}
                </p>
                <p className="mt-3 font-tajawal text-sm font-medium text-figma-text">
                  — {TESTIMONIALS[index].name}
                </p>
              </div>

              {/* Dots + arrows */}
              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="السابق"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70"
                >
                  <ChevronRight className="h-5 w-5 text-figma-text" />
                </button>

                <div className="flex items-center gap-2">
                  {TESTIMONIALS.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`رأي ${i + 1}`}
                      onClick={() => setIndex(i)}
                      className={
                        "h-2 rounded-full transition-all " +
                        (i === index
                          ? "w-6 bg-figma-header"
                          : "w-2 bg-figma-header/40")
                      }
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={next}
                  aria-label="التالي"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70"
                >
                  <ChevronLeft className="h-5 w-5 text-figma-text" />
                </button>
              </div>
            </div>
          </div>
        </AnimatedItem>
      </AnimatedContainer>
    </section>
  );
};

export default TestimonialsSection;
"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { CustomerReview } from "@/lib/reviews";
import {
  AnimatedContainer,
  AnimatedItem,
} from "@/components/ui/AnimatedContainer";

interface Props {
  reviews: CustomerReview[];
}

const TestimonialsSection = ({ reviews }: Props) => {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const total = reviews.length;
  if (total === 0) return null;

  const safeIndex = Math.min(index, total - 1);
  const current = reviews[safeIndex];

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  const openLightbox = (i: number) => {
    setIndex(i);
    setLightboxOpen(true);
  };

  return (
    <>
      <section className="relative">
        <AnimatedContainer>
          <AnimatedItem>
            <div className="w-full rounded-[20px] border border-black/10 bg-figma-tab px-4 py-6 sm:px-6 sm:py-8">
              <h2 className="mb-5 font-tajawal text-2xl font-extrabold text-figma-text sm:mb-6 sm:text-3xl lg:text-[32px]">
                اراء العملاء
              </h2>

              {/* ═══════════ Desktop / tablet: horizontal scroller ═══════════ */}
              <div className="hidden sm:block">
                <div className="-mx-6 overflow-x-auto px-6 pb-3">
                  <div className="flex gap-4">
                    {reviews.map((review, i) => (
                      <button
                        key={review.id}
                        type="button"
                        onClick={() => openLightbox(i)}
                        className="group relative h-[360px] w-[240px] shrink-0 overflow-hidden rounded-[20px] border border-black/10 bg-white transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-10px_rgba(251,111,146,0.4)] lg:w-[280px]"
                        aria-label={`افتح صورة رأي العميل ${i + 1}`}
                      >
                        <Image
                          src={review.image}
                          alt={`رأي عميل ${i + 1}`}
                          fill
                          sizes="280px"
                          className="object-contain p-3 transition group-hover:scale-[1.02]"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ═══════════ Mobile: single-card carousel ═══════════ */}
              <div className="sm:hidden">
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="relative flex h-[380px] w-full items-center justify-center overflow-hidden rounded-[20px] border border-black/10 bg-white p-3"
                  aria-label="افتح الصورة"
                >
                  <Image
                    src={current.image}
                    alt={`رأي عميل ${safeIndex + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain p-3"
                  />
                </button>

                {total > 1 && (
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={prev}
                      aria-label="السابق"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 ring-1 ring-ink/5 transition hover:bg-white"
                    >
                      <ChevronRight className="h-5 w-5 text-figma-text" />
                    </button>

                    <div className="flex items-center gap-2">
                      {reviews.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          aria-label={`رأي ${i + 1}`}
                          onClick={() => setIndex(i)}
                          className={
                            "h-2 rounded-full transition-all " +
                            (i === safeIndex
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
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 ring-1 ring-ink/5 transition hover:bg-white"
                    >
                      <ChevronLeft className="h-5 w-5 text-figma-text" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </AnimatedItem>
        </AnimatedContainer>
      </section>

      {/* ═══════════ Lightbox (unchanged) ═══════════ */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="إغلاق"
            className="absolute end-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {total > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="السابق"
              className="absolute start-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:start-4 sm:h-14 sm:w-14"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          )}

          <div
            className="relative max-h-[85vh] w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[9/16] w-full">
              <Image
                src={current.image}
                alt={`رأي عميل ${safeIndex + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {total > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="التالي"
              className="absolute end-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:end-4 sm:h-14 sm:w-14"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          )}

          {total > 1 && (
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndex(i);
                  }}
                  aria-label={`رأي ${i + 1}`}
                  className={
                    "h-2 rounded-full transition-all " +
                    (i === safeIndex
                      ? "w-6 bg-white"
                      : "w-2 bg-white/40 hover:bg-white/60")
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TestimonialsSection;
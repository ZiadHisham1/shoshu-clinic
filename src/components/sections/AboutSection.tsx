import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";
import { aboutCopy, siteConfig } from "@/lib/constants";
import {
  AnimatedContainer,
  AnimatedItem,
} from "@/components/ui/AnimatedContainer";

const AboutSection = () => {
  return (
    <section id="about" className="relative w-full">
      <AnimatedContainer>
        <AnimatedItem>
          <div className="w-full rounded-[20px] border border-black/10 bg-figma-tab px-4 py-6 sm:px-6 sm:py-8">
            {/* ═══════════ Label ═══════════ */}
            <div className="mb-5 flex items-center gap-2 sm:mb-6">
              <Sparkles className="h-4 w-4 text-figma-header" />
              <p className="font-tajawal text-xs font-bold uppercase tracking-wide text-figma-header sm:text-sm">
                {aboutCopy.label}
              </p>
            </div>

            {/* ═══════════ Main grid ═══════════ */}
            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-10">
              {/* ─── Image holder (left on desktop, top on mobile) ─── */}
              <div className="relative w-full">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] border border-black/10 bg-white shadow-[0_20px_40px_-20px_rgba(251,111,146,0.4)]">
                  <Image
                    src="/img/about.png"
                    alt="فريق شيماء كلينك"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority={false}
                  />
                  {/* Decorative gradient overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>

                {/* Floating badge on the image */}
                <div className="absolute -bottom-4 end-4 rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-ink/10 sm:end-6">
                  <p className="font-tajawal text-xl font-extrabold text-figma-text sm:text-2xl">
                    {aboutCopy.highlights[1].title}
                  </p>
                  <p className="font-tajawal text-[10px] text-figma-textMut sm:text-xs">
                    {aboutCopy.highlights[1].subtitle}
                  </p>
                </div>
              </div>

              {/* ─── Content ─── */}
              <div className="space-y-5">
                <h2 className="font-tajawal text-2xl font-extrabold leading-tight text-figma-text sm:text-3xl lg:text-4xl">
                  {aboutCopy.heading}
                </h2>

                <div className="space-y-3">
                  {aboutCopy.paragraphs.map((paragraph, i) => (
                    <p
                      key={i}
                      className="font-tajawal text-sm leading-relaxed text-figma-text/80 sm:text-base"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* ─── Highlights (stats) ─── */}
                <div className="grid grid-cols-3 gap-3 rounded-2xl bg-white/60 p-3 ring-1 ring-ink/5">
                  {aboutCopy.highlights.map((item, i) => (
                    <div key={i} className="text-center">
                      <p className="font-tajawal text-xl font-extrabold text-figma-header sm:text-2xl">
                        {item.title}
                      </p>
                      <p className="mt-0.5 font-tajawal text-[10px] text-figma-textMut sm:text-xs">
                        {item.subtitle}
                      </p>
                    </div>
                  ))}
                </div>

                {/* ─── CTA ─── */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href={siteConfig.bookingUrl}
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-figma-header px-6 font-tajawal text-sm font-bold text-white shadow-[0_10px_30px_-10px_rgba(251,111,146,0.6)] transition hover:bg-figma-header/90 sm:text-base"
                  >
                    <span>{aboutCopy.ctaLabel}</span>
                  </Link>

                  <Link
                    href="/booking"
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-tajawal text-sm font-bold text-figma-text ring-1 ring-ink/10 transition hover:bg-figma-tab/40 sm:text-base"
                  >
                    <CheckCircle2 className="h-4 w-4 text-figma-header" />
                    <span>تعرفي على خدماتنا</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </AnimatedItem>
      </AnimatedContainer>
    </section>
  );
};

export default AboutSection;
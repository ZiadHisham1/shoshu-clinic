import { tiktokVideos, tiktokProfileUrl } from "@/lib/constants";
import {
  AnimatedContainer,
  AnimatedItem,
} from "@/components/ui/AnimatedContainer";
import { TikTokGrid } from "./TikTokGrid";

const TikTokSection = () => {
  if (tiktokVideos.length === 0) return null;

  return (
    <section id="tiktok" className="relative">
      <AnimatedContainer>
        <AnimatedItem>
          <div className="w-full rounded-[20px] border border-black/10 bg-figma-tab px-4 py-6 sm:px-6 sm:py-8">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
              <div>
                <h2 className="font-tajawal text-2xl font-extrabold text-figma-text sm:text-3xl lg:text-[32px]">
                  نصائح الدكتورة
                </h2>
                <p className="mt-0.5 font-tajawal text-xs text-figma-textMut sm:text-sm">
                  فيديوهات قصيرة من TikTok
                </p>
              </div>

              <a
                href={tiktokProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-figma-header px-4 font-tajawal text-sm font-bold text-white transition hover:bg-figma-header/90"
              >
                <TikTokIcon className="h-4 w-4" />
                <span className="hidden sm:inline">متابعة</span>
              </a>
            </div>

            {/* Grid */}
            <TikTokGrid videos={tiktokVideos} />
          </div>
        </AnimatedItem>
      </AnimatedContainer>
    </section>
  );
};

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M16.5 3a5.5 5.5 0 0 0 4.5 4.7V11a8.5 8.5 0 0 1-4.5-1.3v6.05A6.25 6.25 0 1 1 10.25 9.5c.26 0 .51.02.75.06v3.4a2.85 2.85 0 1 0 2.1 2.75V3h3.4Z" />
    </svg>
  );
}

export default TikTokSection; 
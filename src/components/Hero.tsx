import Image from "next/image";

const tabs = [
  { id: "slimming", label: "تخسيس", active: true, width: "w-[100px] sm:w-[108px]" },
  { id: "physio", label: "علاج طبيعي", active: false, width: "w-[120px] sm:w-[131px]" },
  { id: "hijama", label: "حجامة", active: false, width: "w-[80px] sm:w-[87px]" },
];

export default function Hero() {
  return (
    <section
      dir="rtl"
      className="relative w-full overflow-hidden bg-figma-page"
    >
      {/* Background image + overlay */}
      <div className="absolute inset-0">
        <Image
          src="/img/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[55%45%]"
        />
        {/* Figma overlay: #654a4a at 30% */}
        <div className="absolute inset-0 bg-[rgba(101,74,74,0.3)]" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-[280px] max-w-7xl flex-col justify-center px-4 pt-48 pb-8 sm:min-h-[340px] sm:px-6 sm:py-16 lg:min-h-[384px] lg:h-[500px] lg:px-8">
        <div className="flex flex-col gap-6">
          {/* Title — two lines on mobile, inline on desktop */}
          <h1 className="flex flex-col gap-0 text-end font-tajawal text-4xl font-extrabold leading-tight text-white/90 sm:text-5xl lg:flex-col items-start lg:gap-4 lg:text-6xl">
            <span>عيشي براحة</span>
            <span>الصحة اسلوب حياه</span>
          </h1>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {tabs.map((t) => (
              <a
                key={t.id}
                href="#services" 
                className={[
                  "flex h-[42px] items-center justify-center rounded-[30px]",
                  "font-tajawal text-base font-extrabold text-figma-text sm:text-lg",
                  t.width,
                  t.active
                    ? "border border-white bg-figma-tabOn"
                    : "border border-black/30 bg-figma-tab",
                ].join(" ")}
              >
                {t.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
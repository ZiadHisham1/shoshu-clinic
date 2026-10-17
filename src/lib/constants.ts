import {
  Accessibility,
  Activity,
  Bone,
  Droplet,
  Droplets,
  PersonStanding,
  Syringe,
  Waves,
  Zap,
} from "lucide-react";
import type { PhysioCondition, ServiceCategory } from "@/types";

/* ============================================================
   Supabase Storage helpers
   ============================================================ */

const STORAGE_BASE = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL;
const VIDEO_BASE = process.env.NEXT_PUBLIC_SUPABASE_VIDEO_URL;

/** Public URL for an image in the `site-images` bucket. Falls back to /img/... */
export function imageUrl(path: string): string {
  const clean = path.replace(/^\/+/, "");
  if (!STORAGE_BASE) return `/img/${clean}`;
  return `${STORAGE_BASE}/${clean}`;
}

/** Public URL for a video in the `tiktok-videos` bucket. Falls back to /videos/... */
export function videoUrl(path: string): string {
  const clean = path.replace(/^\/+/, "");
  if (!VIDEO_BASE) return `/videos/${clean}`;
  return `${VIDEO_BASE}/${clean}`;
}

/* ============================================================
   Site config
   ============================================================ */

export const siteConfig = {
  name: "عيادة الدكتورة شيما نوار",
  description: "تخسيس، علاج طبيعي وحجامة — خصم علي اول استشارة",
  bookingUrl: "/booking",
  whatsapp: "201126661822",
  facebook: "https://www.facebook.com/shimaclinic",
  tiktok: "https://www.tiktok.com/@user3920978815806",
  instgrame: "https://www.instagram.com/drshimaclinic",
  availability: "متاح 6 أيام في الأسبوع",
};

/* ============================================================
   Copy
   ============================================================ */

export const copy = {
  heroLines: ["خسي بصحة...", "و ريحي بجسمك"],
  treatments: ["تخسيس", "علاج طبيعي", "حجامة"],
  servicesCta: "تعرّفي على الخدمات",
  bookNow: "احجزي الآن",
  bookingTitle: "احجزي جلستك الآن",
  bookingSubtitle: "استشارة أولى مجاناً",
  nutritionTitle: "متابعة أسبوعية للتغذية",
  nutritionBadge: "يشمل النحافة والثمنة",
  physioTitle: "العلاج الطبيعي",
  hijamaTitle: "الحجامة",
  hijamaSubtitle: "تنشيط الدورة الدموية وطرد السموم من الجسم",
  servicesLabel: "خدماتنا",
  tabsLabel: "فئات الخدمات",
};

/* ============================================================
   Physio conditions
   ============================================================ */

export const physioConditions: PhysioCondition[] = [
  { id: "back", label: "فقرات الظهر", icon: Activity },
  { id: "neck", label: "الفقرات العنقية", icon: PersonStanding },
  { id: "knee", label: "خشونة الركبة", icon: Bone },
  { id: "lumbar", label: "الفقرات القطنية", icon: Accessibility },
  { id: "chronic", label: "الألم المزمن", icon: Zap },
];

/* ============================================================
   Service categories
   ============================================================ */

export const serviceCategories: ServiceCategory[] = [
  {
    id: "slimming",
    label: "تخسيس",
    items: [
      {
        id: "injections",
        title: "حقن التخسيس",
        subtitle: "بديل تكميم، وجوفي، منجارو، ريتا",
        icon: Syringe,
        description:
          "حقن آمنة وفعّالة لإنقاص الوزن تحت إشراف طبي كامل. تعمل على تقليل الشهية وحرق الدهون بسرعة مع نتائج ملحوظة من الأسابيع الأولى.",
        image: "/img/services/slimming-injections.jpg",
        gradient: "from-[#ffe5ec] via-[#ffc2d1] to-[#ff8fab]",
      },
      {
        id: "meso",
        title: "ميزو ثيرابي موضعي",
        subtitle: "أمريكي، أسباني",
        icon: Droplet,
        description:
          "جلسات ميزو ثيرابي لنحت الجسم وشد الترهلات موضعياً. تركيبات أمريكية وأسبانية عالية الجودة.",
        image: "/img/services/slimming-meso.jpg",
        gradient: "from-[#fff0f3] via-[#ffc2d1] to-[#ff8fab]",
      },
      {
        id: "devices",
        title: "أجهزة تخسيس موضعية",
        subtitle: "EMS, Cavitation, Cavi-Pro",
        icon: Waves,
        description:
          "أحدث أجهزة نحت الجسم: EMS لتحفيز العضلات، الكافيتيشن لتكسير الدهون، و Cavi-Pro للشد.",
        image: "/img/services/slimming-devices.jpg",
        gradient: "from-[#ffe5ec] via-[#ffb3c6] to-[#fb6f92]",
      },
    ],
  },
  {
    id: "physio",
    label: "علاج طبيعي",
    items: physioConditions.map(({ id, label, icon }) => ({
      id,
      title: label,
      icon,
      description:
        "برنامج علاجي متكامل يشمل جلسات كهربائية، تمارين تقوية، وتصحيح وضعية الجسم.",
      image: `/img/services/physio-${id}.jpg`,
      gradient: "from-[#e8f4f8] via-[#c9e5ec] to-[#8fcbd9]",
    })),
  },
  {
    id: "hijama",
    label: "حجامة",
    items: [
      {
        id: "hijama",
        title: copy.hijamaTitle,
        subtitle: copy.hijamaSubtitle,
        icon: Droplets,
        description:
          "الحجامة الرطبة والجافة على يد مختصين. تُحسّن الدورة الدموية وتُخفّف آلام الظهر والصداع.",
        image: "/img/services/hijama.jpg",
        gradient: "from-[#fff5e6] via-[#ffd9b3] to-[#ffb877]",
      },
    ],
  },
];

/* ============================================================
   TikTok videos
   ============================================================ */

export interface TikTokVideo {
  id: string;
  /** MP4 source URL (Supabase or fallback) */
  src: string;
  /** Poster thumbnail URL */
  poster: string;
  /** Caption shown below the video */
  caption: string;
  /** Optional view count like "12.4K" */
  views?: string;
  /** Optional link to the original TikTok post */
  tiktokUrl?: string;
}

export const tiktokProfileUrl =
  "https://www.tiktok.com/@user3920978815806";

export const tiktokVideos: TikTokVideo[] = [
  {
    id: "1",
    src: videoUrl("video-1.mp4"),
    poster: imageUrl("tiktok/tik-imgs/video-1.png"),
    caption: "نصائح لتخسيس سريع وفعّال",
    views: "12.4K",
    tiktokUrl: "https://www.tiktok.com/@user3920978815806/video/7674939846980357384",
  },
  {
    id: "2",
    src: videoUrl("video-2.mp4"),
    poster: imageUrl("tiktok/tik-imgs/video-2.png"),
    caption: "ازاي نخس باستعمال حقن الميزو ثيرابي",
    views: "8.2K",
    tiktokUrl: "https://www.tiktok.com/@user3920978815806/video/7678635000991960328",
  },
  {
    id: "3",
    src: videoUrl("video-3.mp4"),
    poster: imageUrl("tiktok/tik-imgs/video-3.png"),
    caption: "علاج مقاومة الانسولين",
    views: "5.7K",
    tiktokUrl: "https://www.tiktok.com/@user3920978815806/video/7696077101761400116",
  },
  {
    id: "4",
    src: videoUrl("video-4.mp4"),
    poster: imageUrl("tiktok/tik-imgs/video-4.png"),
    caption: "أخطاء شائعة في التخسيس",
    views: "4.1K",
    tiktokUrl: "https://www.tiktok.com/@user3920978815806/video/7696475326724984072",
  }
];


/* ============================================================
   Customer reviews (WhatsApp screenshots)
   ============================================================ */

export interface CustomerReview {
  id: string;
  /** Public URL of the screenshot in Supabase Storage */
  image: string;
  /** Optional customer name — used as alt text */
  name?: string;
}

/** Base URL for the review images in Supabase Storage */
const REVIEWS_BASE =
  "https://yiagmbpjrxbxbnvfedjd.supabase.co/storage/v1/object/public/shima-clinic/tiktok/customer-reviews";

export const customerReviews: CustomerReview[] = [
  {
    id: "1",
    image: `${REVIEWS_BASE}/video-1.png`,
    name: "عميل",
  },
  // Add more reviews as you upload them:
  // {
  //   id: "2",
  //   image: `${REVIEWS_BASE}/WhatsApp%20Image%202026-10-17%20at%2001.12.05.jpeg`,
  //   name: "عميلة",
  // },
  // {
  //   id: "3",
  //   image: `${REVIEWS_BASE}/review-3.jpg`,
  //   name: "عميلة",
  // },
];  

export const aboutCopy = {
  label: "من نحن",
  heading: "شيما كلينك — رعاية تثق بها",
  paragraphs: [
    "شيما كلينك هو مركز متخصص في التخسيس والعلاج الطبيعي والحجامة، يقدم رعاية طبية شاملة تحت إشراف نخبة من الأطباء والمختصين.",
    "نؤمن أن الصحة أسلوب حياة — لذلك نقدم خططاً علاجية مخصصة لكل عميل، تجمع بين أحدث الأجهزة الطبية والبروتوكولات المعتمدة عالمياً.",
    "رحلتك معنا تبدأ باستشارة أولى مجانية، وتستمر بمتابعة دقيقة حتى تحققي نتائجك المستهدفة.",
  ],
  highlights: [
    { title: "+١٠٠٠", subtitle: "عميل سعيد" },
    { title: "١3+", subtitle: "سنوات خبرة" },
    { title: "٦", subtitle: "أيام عمل أسبوعياً" },
  ],
  ctaLabel: "احجزي استشارتك",
};
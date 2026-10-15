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

export const siteConfig = {
  name: "شوشو كلينك",
  description: "تخسيس، علاج طبيعي وحجامة — احجزي استشارتك الأولى مجاناً",
  // Placeholder: replace with the clinic's real WhatsApp / booking URL.
  bookingUrl: "/booking",
  availability: "متاح 7 أيام في الأسبوع",
};

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

export const physioConditions: PhysioCondition[] = [
  { id: "back", label: "فقرات الظهر", icon: Activity },
  { id: "neck", label: "الفقرات العنقية", icon: PersonStanding },
  { id: "knee", label: "خشونة الركبة", icon: Bone },
  { id: "lumbar", label: "القطاني", icon: Accessibility },
  { id: "chronic", label: "الألم المزمن", icon: Zap },
];

export const serviceCategories: ServiceCategory[] = [
  {
    id: "slimming",
    label: "تخسيس",
    items: [
      {
        id: "injections",
        title: "حقن التخسيس",
        subtitle: "بديل تكميم، جوفي، منجارو، ريتا",
        icon: Syringe,
        description:
          "حقن آمنة وفعّالة لإنقاص الوزن تحت إشراف طبي كامل. تعمل على تقليل الشهية وحرق الدهون بسرعة مع نتائج ملحوظة من الأسابيع الأولى. بدائل غير جراحية لعمليات التكميم مع متابعة أسبوعية.",
        image: "/img/services/slimming-injections.jpg",
        gradient: "from-[#ffe5ec] via-[#ffc2d1] to-[#ff8fab]",
      },
      {
        id: "meso",
        title: "ميزو ثيرابي موضعي",
        subtitle: "أمريكي، أسباني",
        icon: Droplet,
        description:
          "جلسات ميزو ثيرابي لنحت الجسم وشد الترهلات موضعياً. تركيبات أمريكية وأسبانية عالية الجودة تُحقن مباشرة في المنطقة المستهدفة لتكسير الدهون وتحسين مظهر الجلد.",
        image: "/img/services/slimming-meso.jpg",
        gradient: "from-[#fff0f3] via-[#ffc2d1] to-[#ff8fab]",
      },
      {
        id: "devices",
        title: "أجهزة تخسيس موضعية",
        subtitle: "EMS, Cavitation, Cavi-Pro",
        icon: Waves,
        description:
          "أحدث أجهزة نحت الجسم: EMS لتحفيز العضلات، الكافيتيشن لتكسير الدهون بالموجات فوق الصوتية، و Cavi-Pro للشد والتقليل من السيلوليت. بدون ألم، بدون فترة راحة.",
        image: "/img/services/slimming-devices.jpg",
        gradient: "from-[#ffe5ec] via-[#ffb3c6] to-[#fb6f92]",
      },
    ],
  },
  {
    id: "physio",
    label: "علاج طبيعي",
    items: [
      {
        id: "back",
        title: "فقرات الظهر",
        subtitle: "علاج الانزلاق الغضروفي والشد العضلي",
        icon: Activity,
        description:
          "برنامج علاجي متكامل لآلام فقرات الظهر، يشمل جلسات كهربائية، تمارين تقوية، وتصحيح وضعية الجسم. مناسب لحالات الانزلاق الغضروفي، الشد العضلي، والتهابات الأعصاب.",
        image: "/img/services/physio-back.jpg",
        gradient: "from-[#e8f4f8] via-[#c9e5ec] to-[#8fcbd9]",
      },
      {
        id: "neck",
        title: "الفقرات العنقية",
        subtitle: "علاج الديسك والتهاب الأعصاب",
        icon: PersonStanding,
        description:
          "جلسات علاج طبيعي للفقرات العنقية تُخفف الصداع، الدوخة، وتنميل الذراعين الناتج عن الديسك أو الجلوس الطويل. يشمل تمارين استطالة، مساج علاجي، وتصحيح الوضعية.",
        image: "/img/services/physio-neck.jpg",
        gradient: "from-[#e8f4f8] via-[#c9e5ec] to-[#8fcbd9]",
      },
      {
        id: "knee",
        title: "خشونة الركبة",
        subtitle: "تأهيل ما بعد الجراحة",
        icon: Bone,
        description:
          "تأهيل متخصص لخشونة الركبة وآلام المفاصل. يشمل تقوية العضلات المحيطة، تحسين المدى الحركي، وتقليل الالتهاب بأجهزة حديثة. مناسب لكبار السن ومرحلة ما بعد الجراحة.",
        image: "/img/services/physio-knee.jpg",
        gradient: "from-[#e8f4f8] via-[#c9e5ec] to-[#8fcbd9]",
      },
      {
        id: "lumbar",
        title: "القطاني",
        subtitle: "علاج آلام أسفل الظهر",
        icon: Accessibility,
        description:
          "علاج مخصص لآلام منطقة الحوض وأسفل الظهر. مزيج من العلاج اليدوي، الأجهزة، وتمارين الاستقرار الأساسية لتحسين الحركة والقضاء على الألم.",
        image: "/img/services/physio-lumbar.jpg",
        gradient: "from-[#e8f4f8] via-[#c9e5ec] to-[#8fcbd9]",
      },
      {
        id: "chronic",
        title: "الألم المزمن",
        subtitle: "برامج إعادة التأهيل",
        icon: Zap,
        description:
          "برنامج شامل للألم المزمن (الرقبة، الكتف، الظهر، الأطراف) يعتمد على تقنيات متعددة: TENS، موجات صدمية، علاج يدوي، وتمارين مخصصة لحالتك.",
        image: "/img/services/physio-chronic.jpg",
        gradient: "from-[#e8f4f8] via-[#c9e5ec] to-[#8fcbd9]",
      },
    ],
  },
  {
    id: "hijama",
    label: "حجامة",
    items: [
      {
        id: "hijama",
        title: "الحجامة",
        subtitle: "تنشيط الدورة الدموية وطرد السموم",
        icon: Droplets,
        description:
          "الحجامة الرطبة والجافة على يد مختصين. تُحسّن الدورة الدموية، تُنشّط الجهاز المناعي، وتُخفف آلام الظهر والصداع. أدوات معقمة للاستخدام مرة واحدة مع بروتوكولات تعقيم كاملة.",
        image: "/img/services/hijama.jpg",
        gradient: "from-[#fff5e6] via-[#ffd9b3] to-[#ffb877]",
      },
    ],
  },
];
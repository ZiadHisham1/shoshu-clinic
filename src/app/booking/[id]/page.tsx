import { notFound } from "next/navigation";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";
import { siteConfig } from "@/lib/constants";
import { WhatsAppConfirmButton } from "./WhatsAppConfirmButton";

export const dynamic = "force-dynamic";

export const metadata = { title: "تم تأكيد حجزك — شوشو كلينك" };

export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    const { id } = await params;
  console.log("[booking/[id]] rendering id:", id);

  const supabase = createPublicClient();

  const { data, error, status, statusText } = await supabase
    .from("bookings")
    .select(
      `id, customer_name, customer_phone, notes, status, created_at,
       slot:slots ( start_at, end_at, service:services (name, duration_minutes) )`
    )
    .eq("id", id)
    .single();

  console.log("[booking/[id]] status:", status, statusText);
  console.log("[booking/[id]] error:", JSON.stringify(error, null, 2));
  console.log("[booking/[id]] data:", JSON.stringify(data, null, 2));

  if (error || !data) {
    console.log("[booking/[id]] → calling notFound()");
    notFound();
  }

  // Flatten Supabase joins
  const slot = Array.isArray(data.slot) ? data.slot[0] : data.slot;
  const service = slot
    ? Array.isArray(slot.service)
      ? slot.service[0]
      : slot.service
    : null;

  const start = slot?.start_at ? new Date(slot.start_at) : null;

  return (
    <main className="min-h-screen bg-figma-page grid place-items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md space-y-5 rounded-3xl bg-white p-5 shadow-[0_10px_40px_-15px_rgba(251,111,146,0.3)] ring-1 ring-ink/10 sm:p-6">
        {/* ═══════════ Success icon ═══════════ */}
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        {/* ═══════════ Title ═══════════ */}
        <div className="space-y-1 text-center">
          <h1 className="font-tajawal text-2xl font-extrabold text-figma-text">
            تم تأكيد حجزك 🎉
          </h1>
          <p className="font-tajawal text-sm text-figma-textMut">
            نتشرف بخدمتك، يرجى الحضور قبل الموعد بـ ١٠ دقائق
          </p>
        </div>

        {/* ═══════════ Booking details ═══════════ */}
        <div className="space-y-2.5 rounded-2xl bg-figma-tab/40 p-4">
          <Row label="الخدمة" value={service?.name ?? "—"} />
          <Row
            label="التاريخ"
            value={
              start
                ? start.toLocaleDateString("ar-EG", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "—"
            }
          />
          <Row
            label="الوقت"
            value={
              start
                ? start.toLocaleTimeString("ar-EG", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"
            }
          />
          {service?.duration_minutes && (
            <Row
              label="المدة"
              value={`${service.duration_minutes} دقيقة`}
            />
          )}
          <Row label="الاسم" value={data.customer_name} />
          <Row label="رقم الهاتف" value={data.customer_phone} />
          {data.notes && <Row label="ملاحظات" value={data.notes} />}
        </div>

        {/* ═══════════ Booking reference ═══════════ */}
        <p className="text-center font-tajawal text-xs text-figma-textMut">
          رقم الحجز:{" "}
          <span dir="ltr" className="font-bold text-figma-text">
            {data.id.slice(-8).toUpperCase()}
          </span>
        </p>

        {/* ═══════════ WhatsApp button ═══════════ */}
        <WhatsAppConfirmButton
          bookingId={data.id}
          customerName={data.customer_name}
          customerPhone={data.customer_phone}
          serviceName={service?.name ?? "—"}
          startAt={slot?.start_at ?? ""}
          notes={data.notes}
          clinicPhone={siteConfig.whatsapp}
        />

        {/* ═══════════ Divider ═══════════ */}
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-ink/10" />
          <span className="font-tajawal text-xs text-figma-textMut">أو</span>
          <span className="h-px flex-1 bg-ink/10" />
        </div>

        {/* ═══════════ Secondary actions ═══════════ */}
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="grid h-12 place-items-center rounded-full bg-white font-tajawal text-ink ring-1 ring-ink/10 transition hover:bg-figma-tab/40"
          >
            العودة للرئيسية
          </Link>
          <Link
            href="/booking"
            className="grid h-12 place-items-center rounded-full bg-white font-tajawal text-ink ring-1 ring-ink/10 transition hover:bg-figma-tab/40"
          >
            حجز موعد آخر
          </Link>
        </div>
      </div>
    </main>
  );
}

/* ─── Row component ─── */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 font-tajawal text-sm">
      <span className="shrink-0 text-figma-textMut">{label}</span>
      <span className="min-w-0 break-words text-end font-bold text-figma-text">
        {value}
      </span>
    </div>
  );
} 
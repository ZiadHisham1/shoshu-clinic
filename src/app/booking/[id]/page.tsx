import { notFound } from "next/navigation";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";

export const dynamic = "force-dynamic";

export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `id, customer_name, customer_phone, notes, status, created_at,
       slot:slots ( start_at, end_at, service:services (name, duration_minutes) )`
    )
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  const slot = data.slot as any;
  const start = new Date(slot.start_at);

  return (
    <main className="min-h-screen bg-cream-100 grid place-items-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white ring-1 ring-ink/10 p-6 space-y-5 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center mx-auto">
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h1 className="font-lalezar text-2xl text-ink">تم تأكيد حجزك</h1>

        <div className="rounded-2xl bg-cream-50 p-4 text-start space-y-2">
          <Row label="الخدمة" value={slot.service?.name ?? "—"} />
          <Row
            label="التاريخ"
            value={start.toLocaleDateString("ar-EG", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />
          <Row
            label="الوقت"
            value={start.toLocaleTimeString("ar-EG", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
          <Row label="الاسم" value={data.customer_name} />
          <Row label="رقم الهاتف" value={data.customer_phone} />
        </div>

        <p className="text-xs text-ink/50 font-lalezar">
          رقم الحجز: <span dir="ltr">{data.id.slice(-8)}</span>
        </p>

        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="h-12 rounded-full bg-primary text-white font-lalezar grid place-items-center"
          >
            العودة للرئيسية
          </Link>
          <Link
            href="/booking"
            className="h-12 rounded-full bg-white ring-1 ring-ink/10 text-ink font-lalezar grid place-items-center"
          >
            حجز آخر
          </Link>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm font-lalezar">
      <span className="text-ink/60">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}
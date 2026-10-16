import { currentUser } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BookingsTable, type Booking } from "@/components/admin/BookingsTable";

export const metadata = { title: "الحجوزات — لوحة التحكم" };
export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const user = await currentUser();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `id, customer_name, customer_phone, notes, status, created_at,
       slot:slots ( start_at, end_at, service:services (name) )`
    )
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("[admin/bookings] query:", error);
    return (
      <main className="min-h-screen grid place-items-center bg-cream-100 px-4">
        <div className="text-center space-y-2">
          <h1 className="font-lalezar text-2xl text-ink">
            تعذر تحميل الحجوزات
          </h1>
          <p className="text-sm text-ink/60">{error.message}</p>
        </div>
      </main>
    );
  }

  // ⬇️ Flatten Supabase's array-wrapped joins
  const bookings: Booking[] = (data ?? []).map((row: any) => {
    const slot = Array.isArray(row.slot) ? row.slot[0] ?? null : row.slot;
    const service = slot
      ? Array.isArray(slot.service)
        ? slot.service[0] ?? null
        : slot.service
      : null;

    return {
      id: row.id,
      customer_name: row.customer_name,
      customer_phone: row.customer_phone,
      notes: row.notes,
      status: row.status,
      created_at: row.created_at,
      slot: slot
        ? {
            start_at: slot.start_at,
            end_at: slot.end_at,
            service: service ? { name: service.name } : null,
          }
        : null,
    };
  });

  // ─── Compute quick stats ───
  const now = Date.now();
  const stats = {
    total: bookings.length,
    today: bookings.filter((b) => {
      if (!b.slot) return false;
      const t = new Date(b.slot.start_at).getTime();
      return (
        t >= new Date().setHours(0, 0, 0, 0) &&
        t < new Date().setHours(23, 59, 59, 999)
      );
    }).length,
    upcoming: bookings.filter((b) => {
      if (!b.slot) return false;
      return new Date(b.slot.start_at).getTime() > now;
    }).length,
    pending: bookings.filter((b) => b.status === "confirmed").length,
  };

  const userName =
    user?.firstName ?? user?.emailAddresses[0]?.emailAddress ?? "";

  return (
    <main className="min-h-screen bg-cream-100 px-3 py-6 sm:px-4 sm:py-8">
      <div className="mx-auto max-w-[1100px] space-y-4 sm:space-y-6">
        {/* ═══════════ Header ═══════════ */}
        <header className="space-y-1">
          <h1 className="font-lalezar text-2xl text-ink sm:text-3xl">
            الحجوزات
          </h1>
          <p className="font-lalezar text-xs text-ink/60 sm:text-sm">
            مرحباً، {userName}
          </p>
        </header>

        {/* ═══════════ Stat cards ═══════════ */}
        <section className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          <StatCard
            label="الإجمالي"
            value={stats.total}
            accent="bg-ink/5 text-ink"
          />
          <StatCard
            label="اليوم"
            value={stats.today}
            accent="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          />
          <StatCard
            label="القادمة"
            value={stats.upcoming}
            accent="bg-sky-50 text-sky-700 ring-1 ring-sky-200"
          />
          <StatCard
            label="مؤكدة"
            value={stats.pending}
            accent="bg-figma-header/10 text-figma-header ring-1 ring-figma-header/30"
          />
        </section>

        {/* ═══════════ Bookings ═══════════ */}
        <BookingsTable initialBookings={bookings} />
      </div>
    </main>
  );
}

/* ─── Stat card ─── */
function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className={"rounded-2xl px-3 py-3 sm:px-4 sm:py-4 " + accent}>
      <p className="font-lalezar text-[11px] uppercase tracking-wide opacity-70 sm:text-xs">
        {label}
      </p>
      <p className="mt-1 font-lalezar text-2xl font-extrabold sm:text-3xl">
        {value}
      </p>
    </div>
  );
}
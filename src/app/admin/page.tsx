import { currentUser, auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { CalendarCheck, Clock, AlertTriangle, ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const user = await currentUser();
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
  const isAdmin = role === "admin";

  const supabase = createAdminClient();

  /* ── Fetch stats in parallel ── */
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);
  const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const [
    totalBookingsRes,
    todayBookingsRes,
    upcomingBookingsRes,
    pendingBookingsRes,
    servicesRes,
    slotsRes,
  ] = await Promise.all([
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayStart.toISOString())
      .lte("created_at", todayEnd.toISOString()),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "confirmed"),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "confirmed"),
    // Only fetch services + slots if admin — managers don't need them
    isAdmin
      ? supabase.from("services").select("id, name").order("name")
      : Promise.resolve({ data: [], error: null }),
    isAdmin
      ? supabase
          .from("slots")
          .select("id, service_id, start_at")
          .gte("start_at", now.toISOString())
          .lte("start_at", in30Days.toISOString())
      : Promise.resolve({ data: [], error: null }),
  ]);

  const totalBookings = totalBookingsRes.count ?? 0;
  const todayBookings = todayBookingsRes.count ?? 0;
  const upcomingConfirmed = upcomingBookingsRes.count ?? 0;
  const pending = pendingBookingsRes.count ?? 0;

  const services = servicesRes.data ?? [];
  const slots = slotsRes.data ?? [];

  /* ── Coverage per service (admin only) ── */
  const coverage = isAdmin
    ? services.map((svc) => {
        const svcSlots = slots.filter((s) => s.service_id === svc.id);
        const latest = svcSlots.reduce<number>(
          (max, s) => Math.max(max, new Date(s.start_at).getTime()),
          0
        );
        const daysAhead = latest
          ? Math.floor((latest - now.getTime()) / (1000 * 60 * 60 * 24))
          : 0;
        return { name: svc.name, daysAhead, count: svcSlots.length };
      })
    : [];

  const lowCoverage = coverage.filter((c) => c.daysAhead < 30);

  const userName =
    user?.firstName ?? user?.emailAddresses[0]?.emailAddress ?? "";

  return (
    <div className="space-y-6">
      {/* ═══════════ Welcome ═══════════ */}
      <div className="rounded-2xl bg-gradient-to-br from-figma-header to-figma-header/80 p-5 text-white sm:p-6">
        <p className="font-lalezar text-sm opacity-90">مرحباً بك</p>
        <h1 className="mt-1 font-lalezar text-2xl font-extrabold sm:text-3xl">
          {userName}
        </h1>
        <p className="mt-1 font-lalezar text-sm opacity-90">
          إليك نظرة سريعة على أداء العيادة
        </p>
      </div>

      {/* ═══════════ Stat cards ═══════════ */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="إجمالي الحجوزات"
          value={totalBookings}
          icon={<CalendarCheck className="h-5 w-5" />}
          tone="neutral"
        />
        <StatCard
          label="حجوزات اليوم"
          value={todayBookings}
          icon={<CalendarCheck className="h-5 w-5" />}
          tone="emerald"
        />
        <StatCard
          label="مؤكدة قادمة"
          value={upcomingConfirmed}
          icon={<Clock className="h-5 w-5" />}
          tone="sky"
        />
        <StatCard
          label="تحتاج متابعة"
          value={pending}
          icon={<AlertTriangle className="h-5 w-5" />}
          tone="amber"
        />
      </div>

      {/* ═══════════ Quick actions ═══════════ */}
      <section className="space-y-3">
        <h2 className="font-lalezar text-lg font-bold text-ink sm:text-xl">
          الإجراءات السريعة
        </h2>

        <div
          className={
            "grid grid-cols-1 gap-3 " + (isAdmin ? "sm:grid-cols-2" : "")
          }
        >
          <NavCard
            href="/admin/bookings"
            title="إدارة الحجوزات"
            description="عرض، تأكيد، وإلغاء حجوزات العملاء"
            icon={<CalendarCheck className="h-6 w-6" />}
            tone="primary"
          />
          {isAdmin && (
            <NavCard
              href="/admin/slots"
              title="إدارة المواعيد"
              description="إنشاء مواعيد متاحة للعملاء وحذف المواعيد القديمة"
              icon={<Clock className="h-6 w-6" />}
              tone="pink"
            />
          )}
        </div>
      </section>

      {/* ═══════════ Coverage warning (admin only) ═══════════ */}
      {isAdmin && lowCoverage.length > 0 && (
        <section className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200 sm:p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="flex-1">
              <h3 className="font-lalezar text-base font-bold text-amber-900">
                مواعيد تنقص قريباً
              </h3>
              <p className="mt-1 font-lalezar text-sm text-amber-800">
                الخدمات التالية لديها أقل من ٣٠ يوم من المواعيد المتاحة.
              </p>

              <ul className="mt-3 space-y-1.5">
                {lowCoverage.map((c) => (
                  <li
                    key={c.name}
                    className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-1.5 font-lalezar text-sm"
                  >
                    <span className="font-bold text-amber-900">{c.name}</span>
                    <span className="text-amber-700">
                      {c.daysAhead} يوم • {c.count} موعد
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/admin/slots"
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 font-lalezar text-sm font-bold text-white transition hover:bg-amber-600"
              >
                <span>تجديد المواعيد الآن</span>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ Recent bookings ═══════════ */}
      <RecentBookingsPreview />
    </div>
  );
}

/* ============================================================
   Stat card
   ============================================================ */
function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: "neutral" | "emerald" | "sky" | "amber";
}) {
  const tones = {
    neutral: "bg-white ring-1 ring-ink/10 text-ink",
    emerald: "bg-emerald-50 ring-1 ring-emerald-200 text-emerald-700",
    sky: "bg-sky-50 ring-1 ring-sky-200 text-sky-700",
    amber: "bg-amber-50 ring-1 ring-amber-200 text-amber-700",
  };

  return (
    <div className={"rounded-2xl p-4 " + tones[tone]}>
      <div className="flex items-center justify-between">
        <p className="font-lalezar text-xs opacity-70 sm:text-sm">{label}</p>
        <span className="opacity-60">{icon}</span>
      </div>
      <p className="mt-2 font-lalezar text-2xl font-extrabold sm:text-3xl">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   Nav card — big tappable action tile
   ============================================================ */
function NavCard({
  href,
  title,
  description,
  icon,
  tone,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tone: "primary" | "pink";
}) {
  const tones = {
    primary: "bg-figma-header text-white",
    pink: "bg-figma-tab/60 text-figma-text",
  };

  return (
    <Link
      href={href}
      className={
        "group flex items-start gap-4 rounded-2xl p-4 shadow-[0_4px_20px_-10px_rgba(251,111,146,0.4)] ring-1 ring-ink/5 transition hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-10px_rgba(251,111,146,0.6)] sm:p-5 " +
        tones[tone]
      }
    >
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/20">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-lalezar text-base font-bold sm:text-lg">{title}</h3>
        <p className="mt-0.5 font-lalezar text-xs opacity-80 sm:text-sm">
          {description}
        </p>
      </div>
      <ArrowLeft className="mt-1 h-5 w-5 shrink-0 opacity-60 transition group-hover:opacity-100" />
    </Link>
  );
}

/* ============================================================
   Recent bookings preview
   ============================================================ */
async function RecentBookingsPreview() {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("bookings")
    .select(
      `id, customer_name, customer_phone, status, created_at,
       slot:slots ( start_at, service:services (name) )`
    )
    .order("created_at", { ascending: false })
    .limit(5);

  const bookings = data ?? [];

  if (bookings.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-lalezar text-lg font-bold text-ink sm:text-xl">
          أحدث الحجوزات
        </h2>
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-1 font-lalezar text-sm text-figma-header hover:underline"
        >
          عرض الكل
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-2 rounded-2xl bg-white p-3 ring-1 ring-ink/10 sm:p-4">
        {bookings.map((b: any) => {
          const slot = Array.isArray(b.slot) ? b.slot[0] : b.slot;
          const service = slot
            ? Array.isArray(slot.service)
              ? slot.service[0]
              : slot.service
            : null;
          const start = slot?.start_at ? new Date(slot.start_at) : null;

          return (
            <Link
              key={b.id}
              href="/admin/bookings"
              className="flex items-center justify-between gap-3 rounded-xl p-2 transition hover:bg-cream-50 sm:p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-lalezar text-sm font-bold text-ink sm:text-base">
                  {b.customer_name}
                </p>
                <p className="truncate font-lalezar text-xs text-ink/60">
                  {service?.name ?? "—"}
                  {start &&
                    ` • ${start.toLocaleDateString("ar-EG", {
                      day: "numeric",
                      month: "short",
                    })} • ${start.toLocaleTimeString("ar-EG", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`}
                </p>
              </div>
              <StatusPill status={b.status} />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    confirmed: {
      label: "مؤكد",
      cls: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
    completed: {
      label: "مكتمل",
      cls: "bg-sky-50 text-sky-700 ring-sky-200",
    },
    cancelled: {
      label: "ملغي",
      cls: "bg-rose-50 text-rose-700 ring-rose-200",
    },
  };

  const config = map[status] ?? map.confirmed;

  return (
    <span
      className={
        "shrink-0 rounded-full px-2.5 py-1 font-lalezar text-xs font-bold ring-1 " +
        config.cls
      }
    >
      {config.label}
    </span>
  );
}
import { createAdminClient } from "@/lib/supabase/admin";
import { SlotsManager } from "./SlotsManager";

export const metadata = { title: "إدارة المواعيد — شوشو كلينك" };
export const dynamic = "force-dynamic";

export default async function AdminSlotsPage() {
  const supabase = createAdminClient();

  const [servicesRes, slotsRes] = await Promise.all([
    supabase
      .from("services")
      .select("id, name, duration_minutes")
      .order("name"),
    supabase
      .from("slots")
      .select(
        `id, service_id, start_at, end_at, is_booked,
         service:services (name)`
      )
      .gte("start_at", new Date().toISOString())
      .order("start_at", { ascending: true })
      .limit(2000),
  ]);

  if (servicesRes.error || slotsRes.error) {
    return (
      <main className="p-8 text-center">
        <h1 className="font-lalezar text-2xl text-ink">
          تعذر تحميل المواعيد
        </h1>
        <p className="text-sm text-ink/60 mt-2">
          {(servicesRes.error || slotsRes.error)?.message}
        </p>
      </main>
    );
  }

  const services = servicesRes.data ?? [];
  const slots = slotsRes.data ?? [];

  // ─── Compute coverage per service ───
  const now = Date.now();
  const coverage = services.map((svc) => {
    const svcSlots = slots.filter((s) => s.service_id === svc.id);
    const latest = svcSlots.reduce<number>(
      (max, s) => Math.max(max, new Date(s.start_at).getTime()),
      0
    );
    const daysAhead = latest
      ? Math.floor((latest - now) / (1000 * 60 * 60 * 24))
      : 0;
    return { svc, count: svcSlots.length, daysAhead };
  });

  const lowCoverage = coverage.filter((c) => c.daysAhead < 30);

  return (
    <main className="min-h-screen bg-cream-100 px-4 py-8">
      <div className="mx-auto max-w-[1100px] space-y-6">
        <header>
          <h1 className="font-lalezar text-3xl text-ink">إدارة المواعيد</h1>
          <p className="text-sm text-ink/60 font-lalezar mt-0.5">
            أنشئ مواعيد متاحة للحجز أو احذف الموجود منها
          </p>
        </header>

        {/* ═══════════ Coverage Warning ═══════════ */}
        {lowCoverage.length > 0 && (
          <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <h2 className="font-lalezar text-base font-bold text-amber-900">
                  مواعيد تنقص قريباً
                </h2>
                <p className="mt-1 font-lalezar text-sm text-amber-800">
                  الخدمات التالية لديها أقل من ٣٠ يوم من المواعيد المتاحة. استخدم
                  زر «إنشاء لكل الخدمات» لتجديدها.
                </p>

                <ul className="mt-3 space-y-1">
                  {lowCoverage.map((c) => (
                    <li
                      key={c.svc.id}
                      className="flex items-center justify-between rounded-lg bg-white/60 px-3 py-1.5 font-lalezar text-sm"
                    >
                      <span className="text-amber-900 font-bold">
                        {c.svc.name}
                      </span>
                      <span className="text-amber-700">
                        {c.daysAhead} يوم متبقي • {c.count} موعد
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ All Services Overview ═══════════ */}
        <section className="rounded-2xl bg-white ring-1 ring-ink/10 p-5 space-y-3">
          <h2 className="font-lalezar text-lg text-ink">
            التغطية الحالية لكل خدمة
          </h2>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {coverage.map((c) => {
              const ok = c.daysAhead >= 30;
              const warn = c.daysAhead >= 14 && c.daysAhead < 30;
              const bad = c.daysAhead < 14;
              return (
                <div
                  key={c.svc.id}
                  className={
                    "flex items-center justify-between rounded-xl border p-3 " +
                    (ok
                      ? "border-emerald-200 bg-emerald-50/50"
                      : warn
                      ? "border-amber-200 bg-amber-50/50"
                      : "border-rose-200 bg-rose-50/50")
                  }
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-lalezar text-sm font-bold text-ink">
                      {c.svc.name}
                    </p>
                    <p className="text-xs text-ink/60 font-lalezar">
                      {c.count} موعد
                    </p>
                  </div>
                  <span
                    className={
                      "ms-2 shrink-0 rounded-full px-2.5 py-1 font-lalezar text-xs font-bold " +
                      (ok
                        ? "bg-emerald-100 text-emerald-700"
                        : warn
                        ? "bg-amber-100 text-amber-700"
                        : "bg-rose-100 text-rose-700")
                    }
                  >
                    {c.daysAhead} يوم
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <SlotsManager services={services} initialSlots={slots} />
      </div>
    </main>
  );
}
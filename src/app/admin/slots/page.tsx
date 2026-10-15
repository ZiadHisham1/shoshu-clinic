import { createAdminClient } from "@/lib/supabase/admin";
import { SlotsManager } from "./SlotsManager";

export const metadata = { title: "إدارة المواعيد — شوشو كلينك" };
export const dynamic = "force-dynamic";

export default async function AdminSlotsPage() {
  const supabase = createAdminClient();        // ← only here

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
      .limit(500),
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

  return (
    <main className="min-h-screen bg-cream-100 px-4 py-8">
      <div className="mx-auto max-w-[1100px] space-y-6">
        <header>
          <h1 className="font-lalezar text-3xl text-ink">إدارة المواعيد</h1>
          <p className="text-sm text-ink/60 font-lalezar mt-0.5">
            أنشئ مواعيد متاحة للحجز أو احذف الموجود منها
          </p>
        </header>

        <SlotsManager
          services={servicesRes.data ?? []}
          initialSlots={slotsRes.data ?? []}
        />
      </div>
    </main>
  );
}
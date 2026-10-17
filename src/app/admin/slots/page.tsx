import { createAdminClient } from "@/lib/supabase/admin";
import { SlotsManager } from "./SlotsManager";

export const metadata = { title: "إدارة المواعيد — شوشو كلينك" };
export const dynamic = "force-dynamic";

export default async function AdminSlotsPage() {
  const supabase = createAdminClient();

  // 1. Fetch services (still needed for the dropdown in UI)
  const { data: servicesRes, error: servicesError } = await supabase
    .from("services")
    .select("id, name, duration_minutes")
    .order("name");

  if (servicesError) {
    return (
      <main className="p-8 text-center">
        <h1 className="font-lalezar text-2xl text-ink">تعذر تحميل المواعيد</h1>
      </main>
    );
  }

  // 2. Fetch ALL slots (paginated to bypass the 1000 limit)
  let slots: any[] = [];
  const PAGE_SIZE = 1000;
  const MAX_SLOTS = 20000;
  const nowIso = new Date().toISOString();

  for (let from = 0; from < MAX_SLOTS; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("slots")
      .select("id, start_at, end_at, is_booked") // <--- NO service_id HERE
      .gte("start_at", nowIso)
      .order("start_at", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.error("[admin/slots] fetch error:", error);
      break;
    }

    if (!data || data.length === 0) break;
    
    slots.push(...data);
    if (data.length < PAGE_SIZE) break;
  }

  const services = servicesRes ?? [];

  // 3. Pass to UI
  return (
    <main className="min-h-screen bg-cream-100 px-4 py-8">
      <div className="mx-auto max-w-[1100px] space-y-6">
        <header>
          <h1 className="font-lalezar text-3xl text-ink">إدارة المواعيد</h1>
          <p className="text-sm text-ink/60 font-lalezar mt-0.5">
            أنشئ مواعيد متاحة للحجز أو احذف الموجود منها
          </p>
        </header>

        <SlotsManager services={services} initialSlots={slots} />
      </div>
    </main>
  );
}
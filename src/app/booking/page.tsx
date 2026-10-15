import { createPublicClient } from "@/lib/supabase/public";
import { BookingFlow } from "@/components/booking/BookingFlow";

export const metadata = { title: "احجز موعدك — شوشو كلينك" };
export const dynamic = "force-dynamic"; // always fresh slots

export default async function BookingPage() {
  const supabase = createPublicClient();

  // Services
  const { data: services, error: servicesError } = await supabase
    .from("services")
    .select("id, name, duration_minutes, price")
    .order("name");

  // Available slots from now onward
  const { data: slots, error: slotsError } = await supabase
    .from("slots")
    .select("id, service_id, start_at, end_at, is_booked")
    .eq("is_booked", false)
    .gte("start_at", new Date().toISOString())
    .order("start_at", { ascending: true })
    .limit(500);

  if (servicesError || slotsError) {
    console.error("[booking] fetch failed:", servicesError || slotsError);
    return (
      <main className="min-h-screen grid place-items-center bg-cream-100 px-4">
        <div className="text-center space-y-2">
          <h1 className="font-lalezar text-2xl text-ink">
            تعذر تحميل بيانات الحجز
          </h1>
          <p className="text-sm text-ink/60">
            {(servicesError || slotsError)?.message}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream-100 pb-24">
      <BookingFlow
        services={services ?? []}
        slots={slots ?? []}
      />
    </main>
  );
}
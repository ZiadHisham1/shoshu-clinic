import { createPublicClient } from "@/lib/supabase/public";
import { BookingFlow } from "@/components/booking/BookingFlow";

export const metadata = { title: "احجز موعدك — شوشو كلينك" };
export const dynamic = "force-dynamic";

export default async function BookingPage() {
  const supabase = createPublicClient();

  // ─── Services ───
  const { data: services, error: servicesError } = await supabase
    .from("services")
    .select("id, name, duration_minutes, price")
    .order("name");

  if (servicesError) {
    return <ErrorScreen message={servicesError.message} />;
  }

  // ─── Slots — paginated to bypass the 1000-row default ───
  const PAGE_SIZE = 1000;
  const MAX_SLOTS = 10000;
  const allSlots: {
    id: string;
    service_id: string;
    start_at: string;
    end_at: string;
    is_booked: boolean;
  }[] = [];

  const now = new Date();
  const in90Days = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

  for (let from = 0; from < MAX_SLOTS; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("slots")
      .select("id, service_id, start_at, end_at, is_booked")
      .eq("is_booked", false)
      .gte("start_at", now.toISOString())
      .lte("start_at", in90Days.toISOString())
      .order("start_at", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.error("[booking] slot fetch error:", error);
      return <ErrorScreen message={error.message} />;
    }

    if (!data || data.length === 0) break;

    allSlots.push(...data);

    if (data.length < PAGE_SIZE) break; // last page
  }

  console.log(`[booking] loaded ${allSlots.length} slots`);

  return (
    <main className="min-h-screen bg-figma-page pb-24" dir="rtl">
      <BookingFlow services={services ?? []} slots={allSlots} />
    </main>
  );
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <main className="min-h-screen grid place-items-center bg-figma-page px-4">
      <div className="text-center space-y-2">
        <h1 className="font-tajawal text-2xl font-extrabold text-figma-text">
          تعذر تحميل بيانات الحجز
        </h1>
        <p className="text-sm text-figma-textMut">{message}</p>
      </div>
    </main>
  );
}
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
    return (
      <main className="min-h-screen grid place-items-center bg-figma-page px-4">
        <div className="text-center space-y-2">
          <h1 className="font-tajawal text-2xl font-extrabold text-figma-text">
            تعذر تحميل بيانات الحجز
          </h1>
          <p className="text-sm text-figma-textMut">{servicesError.message}</p>
        </div>
      </main>
    );
  }

  // ─── All slots (booked + free) — paginated ───
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
      .gte("start_at", now.toISOString())
      .lte("start_at", in90Days.toISOString())
      .order("start_at", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.error("[booking] slot fetch error:", error);
      return (
        <main className="min-h-screen grid place-items-center bg-figma-page px-4">
          <div className="text-center space-y-2">
            <h1 className="font-tajawal text-2xl font-extrabold text-figma-text">
              تعذر تحميل بيانات الحجز
            </h1>
            <p className="text-sm text-figma-textMut">{error.message}</p>
          </div>
        </main>
      );
    }

    if (!data || data.length === 0) break;
    allSlots.push(...data);
    if (data.length < PAGE_SIZE) break;
  }

  // ─── Fetch active bookings to mark overlapping slots ───
  const { data: activeBookings } = await supabase
    .from("bookings")
    .select(
      `id, status,
       slot:slots ( start_at, service:services ( duration_minutes ) )`
    )
    .in("status", ["confirmed", "completed"]);

  // Build list of blocked ranges
  const blockedRanges = (activeBookings ?? [])
    .map((b) => {
      const slot = Array.isArray(b.slot) ? b.slot[0] : b.slot;
      if (!slot) return null;
      const service = Array.isArray(slot.service)
        ? slot.service[0]
        : slot.service;
      const duration = service?.duration_minutes ?? 0;
      const start = new Date(slot.start_at).getTime();
      const end = start + duration * 60 * 1000;
      return { start, end };
    })
    .filter((r): r is { start: number; end: number } => r !== null);

  // Mark each slot as "blocked" if it overlaps a booking (even if the slot itself is unbooked)
  const slotsWithAvailability = allSlots.map((s) => {
    const start = new Date(s.start_at).getTime();
    const end = new Date(s.end_at).getTime();
    const overlaps = blockedRanges.some(
      (r) => start < r.end && end > r.start
    );
    return {
      ...s,
      is_blocked: s.is_booked || overlaps,
    };
  });

  const availableCount = slotsWithAvailability.filter(
    (s) => !s.is_blocked
  ).length;

  console.log(
    `[booking] loaded ${allSlots.length} slots, ${availableCount} available, ${
      allSlots.length - availableCount
    } blocked`
  );

  return (
    <main className="min-h-screen bg-figma-page pb-24" dir="rtl">
      <BookingFlow
        services={services ?? []}
        slots={slotsWithAvailability}
      />
    </main>
  );
}
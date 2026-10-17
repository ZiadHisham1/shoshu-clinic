import { currentUser } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BookingsTable, type Booking } from "@/components/admin/BookingsTable";

export const metadata = { title: "الحجوزات — لوحة التحكم" };
export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const user = await currentUser();
  const supabase = createAdminClient();

  // Fetch bookings + slot + service (via booking.service_id)
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `id, customer_name, customer_phone, notes, status, created_at, duration_minutes,
       service:services ( name ),
       slot:slots ( start_at, end_at )`
    )
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("[admin/bookings] query:", error);
    return (
      <main className="min-h-screen grid place-items-center bg-cream-100">
        <div className="text-center space-y-2">
          <h1 className="font-lalezar text-2xl text-ink">
            تعذر تحميل الحجوزات
          </h1>
          <p className="text-sm text-ink/60">{error.message}</p>
        </div>
      </main>
    );
  }

  // Flatten Supabase joins
  const bookings: Booking[] = (data ?? []).map((row: any) => {
    const slot = Array.isArray(row.slot) ? row.slot[0] ?? null : row.slot;
    const service = Array.isArray(row.service)
      ? row.service[0] ?? null
      : row.service;

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

  const userName =
    user?.firstName ?? user?.emailAddresses[0]?.emailAddress ?? "";

  return (
    <main className="min-h-screen bg-cream-100 px-3 py-6 sm:px-4 sm:py-8">
      <div className="mx-auto max-w-[1100px] space-y-4 sm:space-y-6">
        <header className="space-y-1">
          <h1 className="font-lalezar text-2xl text-ink sm:text-3xl">
            الحجوزات
          </h1>
          <p className="font-lalezar text-xs text-ink/60 sm:text-sm">
            مرحباً، {userName}
          </p>
        </header>

        <BookingsTable initialBookings={bookings} />
      </div>
    </main>
  );
}
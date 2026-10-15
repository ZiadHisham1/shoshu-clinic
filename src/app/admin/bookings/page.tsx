import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  BookingsTable,
  type Booking,
} from "@/components/admin/BookingsTable";

export const metadata = { title: "الحجوزات — لوحة التحكم" };
export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  // Middleware already enforced: signed in + role === "admin".
  const user = await currentUser();

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `id, customer_name, customer_phone, notes, status, created_at,
       slot:slots ( start_at, end_at, service:services (name) )`
    )
    .order("created_at", { ascending: false });

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

  const bookings = (data ?? []) as unknown as Booking[];

  return (
    <main className="min-h-screen bg-cream-100 px-4 py-8">
      <div className="mx-auto max-w-[1100px] space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-lalezar text-3xl text-ink">الحجوزات</h1>
            <p className="text-sm text-ink/60 font-lalezar mt-0.5">
              {bookings.length} حجز •{" "}
              {user?.firstName ?? user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
          <UserButton afterSignOutUrl="/sign-in" />
        </header>

        <BookingsTable initialBookings={bookings} />
      </div>
    </main>
  );
}
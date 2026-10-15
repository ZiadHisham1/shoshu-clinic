"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/lib/supabase/client";   // ← changed
import { BookingStatusBadge } from "./BookingStatusBadge";
import { BookingRowActions } from "./BookingRowActions";
import { BookingsFilters, type StatusFilter } from "./BookingsFilters";
import { cn } from "@/lib/utils";

type Status = "confirmed" | "cancelled" | "completed";

export interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string;
  notes: string | null;
  status: Status;
  created_at: string;
  slot: {
    start_at: string;
    end_at: string;
    service: { name: string } | null;
  } | null;
}

interface Props {
  initialBookings: Booking[];
}

export function BookingsTable({ initialBookings }: Props) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const router = useRouter();
  const supabase = useSupabase();   // ← changed

  /* ── Realtime subscription ── */
  useEffect(() => {
    const channel = supabase
      .channel("bookings-admin-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        async (payload) => {
          // ...(unchanged)
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  /* ── Filtering ── */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => {
      if (status !== "all" && b.status !== status) return false;
      if (!q) return true;
      return (
        b.customer_name.toLowerCase().includes(q) ||
        b.customer_phone.includes(q)
      );
    });
  }, [bookings, status, search]);

  /* ── Counts for filter tabs ── */
  const counts = useMemo(
    () => ({
      all: bookings.length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
    }),
    [bookings]
  );

  function handleUpdated(id: string, newStatus: Status) {
    setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );

    // Refresh the underlying server data (frees slot if cancelled)
    router.refresh();
    }

  return (
    <div className="space-y-4">
      <BookingsFilters
        status={status}
        onStatusChange={setStatus}
        search={search}
        onSearchChange={setSearch}
        counts={counts}
      />

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-lalezar text-ink/50">
            {bookings.length === 0
              ? "لا توجد حجوزات حتى الآن"
              : "لا توجد نتائج مطابقة"}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white ring-1 ring-ink/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream-50 text-ink/60 font-lalezar text-xs">
                <th className="text-start px-4 py-3">العميل</th>
                <th className="text-start px-4 py-3">الخدمة</th>
                <th className="text-start px-4 py-3">الموعد</th>
                <th className="text-start px-4 py-3 hidden md:table-cell">
                  رقم الهاتف
                </th>
                <th className="text-start px-4 py-3">الحالة</th>
                <th className="text-start px-4 py-3 hidden lg:table-cell">
                  تم الإنشاء
                </th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filtered.map((b) => {
                const isNew = newIds.has(b.id);
                return (
                  <tr
                    key={b.id}
                    className={cn(
                      "transition-colors",
                      isNew
                        ? "bg-emerald-50/60 animate-pulse-slow"
                        : "hover:bg-cream-50/60"
                    )}
                  >
                    <td className="px-4 py-3">
                      <p className="font-lalezar text-ink">
                        {b.customer_name}
                      </p>
                      {b.notes && (
                        <p className="text-xs text-ink/50 truncate max-w-[200px]">
                          {b.notes}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3 font-lalezar text-ink/80">
                      {b.slot?.service?.name ?? "—"}
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-lalezar text-ink">
                        {formatDate(b.slot?.start_at)}
                      </p>
                      <p className="text-xs text-ink/50">
                        {formatTime(b.slot?.start_at)} —{" "}
                        {formatTime(b.slot?.end_at)}
                      </p>
                    </td>

                    <td className="px-4 py-3 font-lalezar text-ink/70 hidden md:table-cell">
                      <a
                        href={`tel:${b.customer_phone}`}
                        className="hover:text-primary"
                        dir="ltr"
                      >
                        {b.customer_phone}
                      </a>
                    </td>

                    <td className="px-4 py-3">
                      <BookingStatusBadge status={b.status} />
                    </td>

                    <td className="px-4 py-3 text-xs text-ink/50 hidden lg:table-cell">
                      {formatDate(b.created_at)}
                    </td>

                    <td className="px-4 py-3">
                      <BookingRowActions
                        bookingId={b.id}
                        currentStatus={b.status}
                        onUpdated={handleUpdated}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── Formatting helpers ── */
function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
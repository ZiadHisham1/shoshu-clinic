"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { BookingRowActions } from "./BookingRowActions";
import { BookingsFilters, type StatusFilter } from "./BookingsFilters";

export type Status = "confirmed" | "cancelled" | "completed";

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

  /* ── Counts ── */
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
        <div className="rounded-2xl bg-white p-12 text-center ring-1 ring-ink/10">
          <p className="font-lalezar text-ink/50">
            {bookings.length === 0
              ? "لا توجد حجوزات حتى الآن"
              : "لا توجد نتائج مطابقة"}
          </p>
        </div>
      ) : (
        <>
          {/* ═══════════ MOBILE — Cards ═══════════ */}
          <div className="space-y-3 lg:hidden">
            {filtered.map((b) => (
              <MobileBookingCard
                key={b.id}
                booking={b}
                onUpdated={handleUpdated}
              />
            ))}
          </div>

          {/* ═══════════ DESKTOP — Table ═══════════ */}
          <div className="hidden overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10 lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream-50 text-start font-lalezar text-xs text-ink/60">
                  <th className="px-4 py-3 text-start">العميل</th>
                  <th className="px-4 py-3 text-start">الخدمة</th>
                  <th className="px-4 py-3 text-start">الموعد</th>
                  <th className="px-4 py-3 text-start">الهاتف</th>
                  <th className="px-4 py-3 text-start">الحالة</th>
                  <th className="w-10 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {filtered.map((b) => (
                  <tr key={b.id} className="transition-colors hover:bg-cream-50/60">
                    <td className="px-4 py-3">
                      <p className="font-lalezar text-ink">{b.customer_name}</p>
                      {b.notes && (
                        <p className="max-w-[220px] truncate text-xs text-ink/50">
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
                    <td className="px-4 py-3">
                      <a
                        href={`tel:${b.customer_phone}`}
                        dir="ltr"
                        className="font-lalezar text-ink/70 hover:text-figma-header"
                      >
                        {b.customer_phone}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <BookingStatusBadge status={b.status} />
                    </td>
                    <td className="px-4 py-3">
                      <BookingRowActions
                        bookingId={b.id}
                        currentStatus={b.status}
                        onUpdated={handleUpdated}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

/* ============================================================
   Mobile booking card
   ============================================================ */
function MobileBookingCard({
  booking: b,
  onUpdated,
}: {
  booking: Booking;
  onUpdated: (id: string, status: Status) => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-ink/10">
      {/* Header row: name + status + actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-lalezar text-base font-bold text-ink">
            {b.customer_name}
          </p>
          <p className="font-lalezar text-xs text-ink/60">
            {b.slot?.service?.name ?? "—"}
          </p>
        </div>
        <BookingRowActions
          bookingId={b.id}
          currentStatus={b.status}
          onUpdated={onUpdated}
        />
      </div>

      {/* Status */}
      <div className="mt-2">
        <BookingStatusBadge status={b.status} />
      </div>

      {/* Details grid */}
      <div className="mt-3 space-y-2 rounded-xl bg-cream-50 p-3">
        <Row
          label="الموعد"
          value={
            b.slot
              ? `${formatDate(b.slot.start_at)} • ${formatTime(b.slot.start_at)}`
              : "—"
          }
        />
        <Row
          label="الهاتف"
          value={
            <a
              href={`tel:${b.customer_phone}`}
              dir="ltr"
              className="text-figma-header"
            >
              {b.customer_phone}
            </a>
          }
        />
        {b.notes && <Row label="ملاحظات" value={b.notes} />}
        <Row label="تم الحجز" value={formatDate(b.created_at)} />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 font-lalezar text-sm">
      <span className="shrink-0 text-ink/60">{label}</span>
      <span className="min-w-0 break-words text-end text-ink">{value}</span>
    </div>
  );
}

/* ─── Helpers ─── */
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
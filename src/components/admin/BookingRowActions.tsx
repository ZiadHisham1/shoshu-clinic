"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { updateBookingStatus } from "@/app/admin/slots/actions";

type Status = "confirmed" | "cancelled" | "completed";

interface Props {
  bookingId: string;
  currentStatus: Status;
  onUpdated: (id: string, status: Status) => void;
}

export function BookingRowActions({
  bookingId,
  currentStatus,
  onUpdated,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function setStatus(next: Status) {
    setOpen(false);
    setError(null);

    startTransition(async () => {
      const res = await updateBookingStatus(bookingId, next);
      if (res.ok) {
        onUpdated(bookingId, next);
      } else {
        setError(res.error ?? "فشل التحديث");
        setTimeout(() => setError(null), 3000);
      }
    });
  }

  function cancel() {
    if (!confirm("هل أنت متأكد من إلغاء هذا الحجز؟ سيتم تحرير الموعد.")) return;
    setStatus("cancelled");
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        aria-label="خيارات"
        className={cn(
          "w-8 h-8 rounded-full grid place-items-center transition",
          "hover:bg-ink/5 disabled:opacity-40"
        )}
      >
        {isPending ? (
          <span className="inline-block w-3 h-3 border-2 border-ink/20 border-t-ink rounded-full animate-spin" />
        ) : (
          <svg viewBox="0 0 20 20" className="size-4 text-ink/60" fill="currentColor">
            <circle cx="4" cy="10" r="1.5" />
            <circle cx="10" cy="10" r="1.5" />
            <circle cx="16" cy="10" r="1.5" />
          </svg>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div
            className="
              absolute end-0 top-full mt-1 z-20
              w-44 rounded-xl bg-white
              ring-1 ring-ink/10 shadow-lg
              overflow-hidden font-lalezar text-sm
            "
          >
            {currentStatus !== "confirmed" && (
              <button
                onClick={() => setStatus("confirmed")}
                className="w-full text-start px-4 py-2.5 hover:bg-cream-50 text-ink"
              >
                تعيين كمؤكد
              </button>
            )}
            {currentStatus !== "completed" && (
              <button
                onClick={() => setStatus("completed")}
                className="w-full text-start px-4 py-2.5 hover:bg-cream-50 text-ink"
              >
                تعيين كمكتمل
              </button>
            )}
            {currentStatus !== "cancelled" && (
              <button
                onClick={cancel}
                className="w-full text-start px-4 py-2.5 hover:bg-rose-50 text-rose-600"
              >
                إلغاء الحجز
              </button>
            )}
          </div>
        </>
      )}

      {error && (
        <p className="absolute end-0 top-full mt-1 text-xs text-rose-600 font-lalezar whitespace-nowrap">
          {error}
        </p>
      )}
    </div>
  );
}
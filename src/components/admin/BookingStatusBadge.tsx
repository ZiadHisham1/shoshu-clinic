import { cn } from "@/lib/utils";

type Status = "confirmed" | "cancelled" | "completed";

const LABELS: Record<Status, string> = {
  confirmed: "مؤكد",
  cancelled: "ملغي",
  completed: "مكتمل",
};

const STYLES: Record<Status, string> = {
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-red-100 text-red-700 ring-red-200",
  completed: "bg-ink/5 text-ink/70 ring-ink/10",
};

export function BookingStatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center h-6 px-2.5 rounded-full",
        "font-lalezar text-xs ring-1",
        STYLES[status]
      )}
    >
      {LABELS[status]}
    </span>
  );
}
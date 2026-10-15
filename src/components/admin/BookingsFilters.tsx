"use client";

import { cn } from "@/lib/utils";

export type StatusFilter = "all" | "confirmed" | "cancelled" | "completed";

interface Props {
  status: StatusFilter;
  onStatusChange: (s: StatusFilter) => void;
  search: string;
  onSearchChange: (s: string) => void;
  counts: Record<StatusFilter, number>;
}

const TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "الكل" },
  { value: "confirmed", label: "مؤكد" },
  { value: "completed", label: "مكتمل" },
  { value: "cancelled", label: "ملغي" },
];

export function BookingsFilters({
  status,
  onStatusChange,
  search,
  onSearchChange,
  counts,
}: Props) {
  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ابحث بالاسم أو رقم الهاتف..."
          className="
            w-full h-11 rounded-xl
            bg-white ring-1 ring-ink/10
            px-4 ps-10
            font-lalezar text-sm text-ink
            focus:outline-none focus:ring-2 focus:ring-primary/40
            transition
          "
        />
        <svg
          className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-ink/40"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="9" cy="9" r="6" />
          <path d="M14 14l4 4" strokeLinecap="round" />
        </svg>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const active = status === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onStatusChange(tab.value)}
              className={cn(
                "inline-flex items-center gap-2 h-9 px-3.5 rounded-full",
                "font-lalezar text-sm transition",
                active
                  ? "bg-primary text-white"
                  : "bg-white ring-1 ring-ink/10 text-ink/70 hover:bg-cream-50"
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "inline-flex items-center justify-center",
                  "min-w-[20px] h-5 px-1 rounded-full",
                  "text-[10px] font-bold",
                  active ? "bg-white/25" : "bg-ink/5"
                )}
              >
                {counts[tab.value]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
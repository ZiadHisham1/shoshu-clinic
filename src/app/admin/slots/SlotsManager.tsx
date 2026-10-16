"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  generateSlots,
  deleteSlot,
  deleteSlotsRange,
  verifySlots,
  type GenerateInput,
} from "./actions";

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
}

export interface Slot {
  id: string;
  service_id: string;
  start_at: string;
  end_at: string;
  is_booked: boolean;
  service: { name: string } | null;
}

interface Props {
  services: Service[];
  initialSlots: Slot[];
}

export function SlotsManager({ services, initialSlots }: Props) {
  const router = useRouter();
  const [slots, setSlots] = useState<Slot[]>(initialSlots);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  /* ── Sync when server sends fresh data ── */
  useEffect(() => {
    setSlots(initialSlots);
  }, [initialSlots]);

  /* ── Form state — start empty to avoid SSR/client date mismatch ── */
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [timeStart, setTimeStart] = useState("10:00");
  const [timeEnd, setTimeEnd] = useState("18:00");
  const [duration, setDuration] = useState(30);
  const [skipWeekends, setSkipWeekends] = useState(true);

  /* ── Set date defaults AFTER mount (client-only) ── */
  useEffect(() => {
    setDateFrom(todayIso());
    setDateTo(addDays(todayIso(), 30));
  }, []);

  /* ── Filters ── */
  const [filterService, setFilterService] = useState<string>("all");
  const [showBooked, setShowBooked] = useState(true);

  const visibleSlots = slots
    .filter((s) => filterService === "all" || s.service_id === filterService)
    .filter((s) => showBooked || !s.is_booked);

  const byDate = groupByDate(visibleSlots);

  /* ── Generate for one service ── */
  function handleGenerate() {
    setMessage(null);
    const input: GenerateInput = {
      serviceId,
      dateFrom,
      dateTo,
      timeStart,
      timeEnd,
      durationMinutes: duration,
      skipWeekends,
    };

    startTransition(async () => {
      try {
        const res = await generateSlots(input);

        if (!res.ok) {
          setMessage({ type: "err", text: res.error ?? "فشل الإنشاء" });
          return;
        }

        const check = await verifySlots({ serviceId, dateFrom, dateTo });

        setMessage({
          type: "ok",
          text: `✅ تم إرسال ${res.inserted ?? 0} موعد — العدد الفعلي في قاعدة البيانات: ${check.count}`,
        });

        router.refresh();
      } catch (e) {
        setMessage({
          type: "err",
          text: e instanceof Error ? e.message : "خطأ غير متوقع",
        });
      }
    });
  }

  /* ── Generate for ALL services ── */
  function handleGenerateAll() {
    setMessage(null);
    startTransition(async () => {
      let totalInserted = 0;
      const failed: string[] = [];

      try {
        for (const svc of services) {
          const res = await generateSlots({
            serviceId: svc.id,
            dateFrom,
            dateTo,
            timeStart,
            timeEnd,
            durationMinutes: svc.duration_minutes || duration,
            skipWeekends,
          });
          if (res.ok) {
            totalInserted += res.inserted ?? 0;
          } else {
            failed.push(`${svc.name}: ${res.error}`);
          }
        }

        if (failed.length === 0) {
          setMessage({
            type: "ok",
            text: `✅ تم إنشاء ${totalInserted} موعد لكل الخدمات`,
          });
        } else {
          setMessage({
            type: "err",
            text: `تم إنشاء ${totalInserted} موعد. فشل: ${failed.join(", ")}`,
          });
        }

        router.refresh();
      } catch (e) {
        setMessage({
          type: "err",
          text: e instanceof Error ? e.message : "خطأ غير متوقع",
        });
      }
    });
  }

  /* ── Delete one ── */
  function handleDelete(id: string) {
    if (!confirm("حذف هذا الموعد؟")) return;
    startTransition(async () => {
      try {
        const res = await deleteSlot(id);
        if (res.ok) {
          setSlots((prev) => prev.filter((s) => s.id !== id));
        } else {
          setMessage({ type: "err", text: res.error ?? "فشل الحذف" });
        }
      } catch (e) {
        setMessage({
          type: "err",
          text: e instanceof Error ? e.message : "خطأ غير متوقع",
        });
      }
    });
  }

  /* ── Delete range ── */
  function handleBulkDelete() {
    const from = prompt("من تاريخ (YYYY-MM-DD):", todayIso());
    const to = prompt("إلى تاريخ (YYYY-MM-DD):", addDays(todayIso(), 30));
    if (!from || !to) return;

    const onlyUnbooked = confirm(
      "حذف المواعيد غير المحجوزة فقط؟ (اضغط إلغاء لحذف الكل)"
    );

    startTransition(async () => {
      try {
        const res = await deleteSlotsRange({
          serviceId: filterService === "all" ? undefined : filterService,
          dateFrom: from,
          dateTo: to,
          onlyUnbooked,
        });
        if (res.ok) {
          setMessage({
            type: "ok",
            text: `✅ تم حذف المواعيد بنجاح`,
          });
          router.refresh();
        } else {
          setMessage({ type: "err", text: res.error ?? "فشل الحذف" });
        }
      } catch (e) {
        setMessage({
          type: "err",
          text: e instanceof Error ? e.message : "خطأ غير متوقع",
        });
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* ═══════════ GENERATOR ═══════════ */}
      <section className="rounded-2xl bg-white ring-1 ring-ink/10 p-5 space-y-4">
        <h2 className="font-lalezar text-lg text-ink">إنشاء مواعيد جديدة</h2>

        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              const from = todayIso();
              const to = addDays(todayIso(), 30);
              setDateFrom(from);
              setDateTo(to);
            }}
            className="h-9 px-4 rounded-full bg-primary text-white font-lalezar text-xs font-bold hover:bg-primary/90 transition"
          >
            شهر من اليوم
          </button>
          <button
            type="button"
            onClick={() => {
              setDateFrom(todayIso());
              setDateTo(addDays(todayIso(), 14));
            }}
            className="h-9 px-3 rounded-full bg-white ring-1 ring-ink/10 font-lalezar text-xs text-ink hover:bg-cream-50 hover:ring-primary/40 transition"
          >
            أسبوعين
          </button>
          <button
            type="button"
            onClick={() => {
              setDateFrom(todayIso());
              setDateTo(addDays(todayIso(), 7));
            }}
            className="h-9 px-3 rounded-full bg-white ring-1 ring-ink/10 font-lalezar text-xs text-ink hover:bg-cream-50 hover:ring-primary/40 transition"
          >
            أسبوع
          </button>
        </div>

        {/* Form fields — key on dates forces Firefox to redraw */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Select
            label="الخدمة"
            value={serviceId}
            onChange={setServiceId}
            options={services.map((s) => ({ value: s.id, label: s.name }))}
          />
          <Input
            key={`from-${dateFrom}`}
            label="من تاريخ"
            type="date"
            value={dateFrom}
            onChange={setDateFrom}
          />
          <Input
            key={`to-${dateTo}`}
            label="إلى تاريخ"
            type="date"
            value={dateTo}
            onChange={setDateTo}
          />
          <Input
            label="ساعة البداية"
            type="time"
            value={timeStart}
            onChange={setTimeStart}
          />
          <Input
            label="ساعة النهاية"
            type="time"
            value={timeEnd}
            onChange={setTimeEnd}
          />
          <Select
            label="مدة الموعد"
            value={String(duration)}
            onChange={(v) => setDuration(Number(v))}
            options={[
              { value: "15", label: "15 دقيقة" },
              { value: "20", label: "20 دقيقة" },
              { value: "30", label: "30 دقيقة" },
              { value: "45", label: "45 دقيقة" },
              { value: "60", label: "60 دقيقة" },
            ]}
          />
        </div>

        <label className="flex items-center gap-2 text-sm font-lalezar text-ink/70">
          <input
            type="checkbox"
            checked={skipWeekends}
            onChange={(e) => setSkipWeekends(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          تجاهل أيام الجمعة والسبت
        </label>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isPending || !serviceId || !dateFrom || !dateTo}
            className="h-12 px-6 rounded-full bg-primary text-white font-lalezar hover:bg-primary/90 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isPending ? "جاري الإنشاء..." : "إنشاء المواعيد"}
          </button>

          <button
            type="button"
            onClick={handleGenerateAll}
            disabled={isPending || services.length === 0 || !dateFrom || !dateTo}
            className="h-12 px-6 rounded-full bg-figma-header text-white font-lalezar hover:bg-figma-header/90 disabled:opacity-50 transition"
          >
            {isPending ? "جاري الإنشاء..." : "إنشاء لكل الخدمات"}
          </button>

          <button
            type="button"
            onClick={handleBulkDelete}
            disabled={isPending}
            className="h-12 px-6 rounded-full bg-white ring-1 ring-rose-200 text-rose-600 font-lalezar hover:bg-rose-50 disabled:opacity-50 transition"
          >
            حذف مجموعة
          </button>
        </div>

        {message && (
          <div
            className={cn(
              "rounded-xl px-4 py-3 text-sm font-lalezar ring-1",
              message.type === "ok"
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                : "bg-rose-50 text-rose-700 ring-rose-200"
            )}
            role="status"
          >
            {message.text}
          </div>
        )}
      </section>

      {/* ═══════════ FILTERS ═══════════ */}
      <section className="flex flex-wrap items-center gap-3">
        <Select
          label="الخدمة"
          value={filterService}
          onChange={setFilterService}
          options={[
            { value: "all", label: "الكل" },
            ...services.map((s) => ({ value: s.id, label: s.name })),
          ]}
        />
        <label className="flex items-center gap-2 text-sm font-lalezar text-ink/70 mt-6">
          <input
            type="checkbox"
            checked={showBooked}
            onChange={(e) => setShowBooked(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          عرض المحجوز
        </label>
      </section>

      {/* ═══════════ LIST ═══════════ */}
      <section className="space-y-4">
        {byDate.length === 0 ? (
          <div className="rounded-2xl bg-white ring-1 ring-ink/10 p-12 text-center">
            <p className="font-lalezar text-ink/50">
              لا توجد مواعيد. استخدم النموذج أعلاه لإنشاء مواعيد جديدة.
            </p>
          </div>
        ) : (
          byDate.map(([date, daySlots]) => (
            <div
              key={date}
              className="rounded-2xl bg-white ring-1 ring-ink/10 p-4 space-y-3"
            >
              <h3 className="font-lalezar text-base text-ink">
                {new Date(date).toLocaleDateString("ar-EG", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                <span className="text-xs text-ink/50 ms-2">
                  ({daySlots.length} موعد)
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {daySlots.map((s) => {
                  const t = new Date(s.start_at);
                  return (
                    <div
                      key={s.id}
                      className={cn(
                        "group inline-flex items-center gap-1.5 h-10 ps-3 pe-1 rounded-full font-lalezar text-sm",
                        s.is_booked
                          ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                          : "bg-cream-50 text-ink ring-1 ring-ink/10"
                      )}
                    >
                      <span>
                        {t.toLocaleTimeString("ar-EG", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(s.id)}
                        disabled={isPending}
                        className="w-7 h-7 rounded-full grid place-items-center opacity-0 group-hover:opacity-100 hover:bg-black/10 transition"
                        aria-label="حذف"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

/* ============================================================
   Form primitives
   ============================================================ */
function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-ink/60 font-lalezar mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 rounded-xl bg-white ring-1 ring-ink/10 px-3 font-lalezar text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs text-ink/60 font-lalezar mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 rounded-xl bg-white ring-1 ring-ink/10 px-3 font-lalezar text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ============================================================
   Helpers — UTC-safe so no timezone drift
   ============================================================ */
function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(iso: string, n: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return dt.toISOString().slice(0, 10);
}

function groupByDate(slots: Slot[]): [string, Slot[]][] {
  const map = new Map<string, Slot[]>();
  slots.forEach((s) => {
    const key = s.start_at.slice(0, 10);
    const arr = map.get(key) ?? [];
    arr.push(s);
    map.set(key, arr);
  });
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
}
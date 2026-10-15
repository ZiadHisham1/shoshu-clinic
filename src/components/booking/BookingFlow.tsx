"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { MonthSlotPicker } from "./MonthSlotPicker";
import { DetailsStep } from "./DetailsStep";
import { BookingSummary } from "./BookingSummary";
import { digitsOnly, isValidEgPhone } from "@/lib/phone";

export interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price: number | null;
}

export interface Slot {
  id: string;
  service_id: string;
  start_at: string;
  end_at: string;
  is_booked: boolean;
}

interface Props {
  services: Service[];
  slots: Slot[];
}

export function BookingFlow({ services, slots }: Props) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [service, setService] = useState<Service | null>(services[0] ?? null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const serviceSlots = service
    ? slots.filter((s) => s.service_id === service.id)
    : [];

  const phoneDigits = digitsOnly(phone);
  const canSubmit =
    !!service &&
    !!slot &&
    name.trim().length >= 2 &&
    isValidEgPhone(phoneDigits);

  async function confirm() {
    setError(null);

    if (!service) return setError("اختر الخدمة أولاً");
    if (!slot) return setError("اختر الموعد أولاً");
    if (name.trim().length < 2) return setError("من فضلك أدخل الاسم");
    if (!isValidEgPhone(digitsOnly(phone))) {
      return setError("من فضلك أدخل رقم هاتف صحيح (11 رقم، يبدأ بـ 01)");
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot_id: slot.id,
          customer_name: name.trim(),
          customer_phone: phoneDigits,
          notes: notes.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error === "SLOT_ALREADY_BOOKED"
            ? "هذا الموعد تم حجزه للتو. اختر موعداً آخر."
            : data.message ?? "فشل إنشاء الحجز"
        );
        setSubmitting(false);
        return;
      }

      router.push(`/booking/${data.booking.id}`);
    } catch (e) {
      setError((e as Error).message ?? "حدث خطأ غير متوقع");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-40 pt-8 sm:px-6 sm:pt-12 lg:px-8">
      {/* ═══════════ Header ═══════════ */}
      <header className="relative mb-6 sm:mb-8">
        {/* Back button — pinned top-start (top-right in RTL) */}
        <Link
          href="/"
          aria-label="العودة للصفحة الرئيسية"
          className="absolute end-0 top-0 inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 font-tajawal text-sm font-bold text-figma-text ring-1 ring-ink/10 transition hover:bg-figma-tab/40 hover:ring-figma-header/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-header"
        >
          <ArrowRight className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">العودة للرئيسية</span>
        </Link>

        {/* Centered title + subtitle */}
        <div className="px-12 text-center sm:px-0">
          <h1 className="font-tajawal text-2xl font-extrabold text-figma-text sm:text-3xl">
            حجز المواعيد
          </h1>
          <p className="mt-1 font-tajawal text-sm text-figma-textMut sm:text-base">
            اختار التاريخ والموعد المناسب
          </p>
        </div>
      </header>

      {/* ═══════════ Main card ═══════════ */}
      <div className="rounded-3xl bg-figma-tab/60 p-3 ring-1 ring-ink/10 sm:p-5 lg:p-6">
        {/* Service selector (compact pills) */}
        <div className="mb-4 flex flex-wrap gap-2 sm:mb-6">
          {services.map((s) => {
            const active = service?.id === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setService(s);
                  setSlot(null);
                }}
                className={
                  "h-10 rounded-full px-4 font-tajawal text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-header " +
                  (active
                    ? "bg-figma-header text-white shadow-[0_6px_20px_-8px_rgba(251,111,146,0.6)]"
                    : "bg-white text-figma-text ring-1 ring-ink/10 hover:bg-figma-tab/40")
                }
              >
                {s.name}
              </button>
            );
          })}
        </div>

        {/* Calendar + Slots */}
        <MonthSlotPicker
          slots={serviceSlots}
          selected={slot}
          onSelect={setSlot}
        />

        {/* Dotted divider */}
        <div className="my-6 border-t border-dashed border-figma-header/40" />

        {/* ═══════════ Details form ═══════════ */}
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-tajawal text-lg font-extrabold text-figma-text sm:text-xl">
              تفاصيل الحجز
            </h2>

            {/* "Pick another slot" — only when a slot is selected */}
            <AnimatePresence>
              {slot && (
                <motion.button
                  key="reselect"
                  type="button"
                  onClick={() => setSlot(null)}
                  initial={reduceMotion ? undefined : { opacity: 0, x: 12 }}
                  animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: 12 }}
                  transition={{ duration: 0.22 }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-tajawal text-xs font-bold text-figma-header ring-1 ring-figma-header/30 transition hover:bg-figma-header hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-header"
                  aria-label="اختيار موعد آخر"
                >
                  <ArrowRight className="h-3.5 w-3.5 rotate-180" aria-hidden />
                  <span>اختيار موعد آخر</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <DetailsStep
            service={service!}
            slot={slot}
            name={name}
            phone={phone}
            notes={notes}
            onChangeName={setName}
            onChangePhone={setPhone}
            onChangeNotes={setNotes}
            onBack={() => setSlot(null)}
            onConfirm={confirm}
            submitting={submitting}
            error={error}
            canSubmit={canSubmit}
          />
        </div>
      </div>

      {/* Sticky summary (only when both selected) */}
      <AnimatePresence>
        {service && slot && (
          <BookingSummary service={service} slot={slot} />
        )}
      </AnimatePresence>
    </div>
  );
}
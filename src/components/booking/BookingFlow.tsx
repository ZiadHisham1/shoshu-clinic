"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { MonthSlotPicker } from "./MonthSlotPicker";
import { DetailsStep } from "./DetailsStep";
import { BookingSummary } from "./BookingSummary";
import { digitsOnly, isValidEgPhone } from "@/lib/phone";
import { stepFade } from "@/lib/motion";

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

type Step = 1 | 2 | 3;

interface Props {
  services: Service[];
  slots: Slot[];
}

export function BookingFlow({ services, slots }: Props) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [step, setStep] = useState<Step>(1);
  const [service, setService] = useState<Service | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Declare derived value FIRST
  const serviceSlots = service
    ? slots.filter((s) => s.service_id === service.id)
    : [];

  // ✅ useEffect can now safely reference serviceSlots
  useEffect(() => {
    console.log("[BookingFlow] total slots:", slots.length);
    console.log("[BookingFlow] service slots:", serviceSlots.length);
    if (service) {
      console.log("[BookingFlow] selected service:", service.name);
      const dates = Array.from(
        new Set(serviceSlots.map((s) => s.start_at.slice(0, 10)))
      );
      console.log("[BookingFlow] available dates:", dates.length, dates);
    }
  }, [slots.length, serviceSlots.length, service]);

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
      {/* Header */}
      <header className="relative mb-6 sm:mb-8">
        <Link
          href="/"
          aria-label="العودة للصفحة الرئيسية"
          className="absolute end-0 top-0 inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 font-tajawal text-sm font-bold text-figma-text ring-1 ring-ink/10 transition hover:bg-figma-tab/40 hover:ring-figma-header/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-header"
        >
          <ArrowRight className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">العودة للرئيسية</span>
        </Link>

        <div className="px-12 text-center sm:px-0">
          <h1 className="font-tajawal text-2xl font-extrabold text-figma-text sm:text-3xl">
            حجز المواعيد
          </h1>
          <p className="mt-1 font-tajawal text-sm text-figma-textMut sm:text-base">
            احجزي جلستك في ٣ خطوات سهلة
          </p>
        </div>
      </header>

      {/* Step indicator */}
      <div className="mx-auto mb-6 flex max-w-md items-center justify-center gap-2 sm:mb-8">
        {([1, 2, 3] as Step[]).map((n, i) => {
          const active = step === n;
          const done = step > n;
          const labels = ["الخدمة", "الموعد", "التفاصيل"];
          return (
            <div key={n} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition " +
                    (done
                      ? "bg-figma-header text-white"
                      : active
                      ? "bg-figma-header text-white ring-4 ring-figma-header/20"
                      : "bg-ink/10 text-ink/40")
                  }
                >
                  {done ? <Check className="h-4 w-4" /> : n}
                </div>
                <span
                  className={
                    "hidden font-tajawal text-xs sm:inline " +
                    (active || done ? "text-figma-text" : "text-figma-textMut")
                  }
                >
                  {labels[i]}
                </span>
              </div>
              {n < 3 && (
                <span
                  className={
                    "h-0.5 w-6 rounded-full transition sm:w-10 " +
                    (step > n ? "bg-figma-header" : "bg-ink/10")
                  }
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Main card */}
      <div className="rounded-3xl bg-figma-tab/60 p-3 ring-1 ring-ink/10 sm:p-5 lg:p-6">
        <AnimatePresence mode="wait" initial={false}>
          {/* STEP 1 — Service */}
          {step === 1 && (
            <motion.div
              key="step-1"
              variants={reduceMotion ? undefined : stepFade}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <h2 className="mb-4 font-tajawal text-lg font-extrabold text-figma-text sm:text-xl">
                اختر الخدمة
              </h2>

              {services.length === 0 ? (
                <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-ink/10">
                  <p className="font-tajawal text-sm text-figma-textMut">
                    لا توجد خدمات متاحة حالياً
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {services.map((s) => {
                    const active = service?.id === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setService(s);
                          setSlot(null);
                          setStep(2);
                        }}
                        className={
                          "group flex items-start gap-3 rounded-2xl border p-4 text-start transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-header " +
                          (active
                            ? "border-figma-header bg-white shadow-[0_6px_20px_-8px_rgba(251,111,146,0.5)] ring-2 ring-figma-header/30"
                            : "border-ink/10 bg-white hover:border-figma-header/40 hover:bg-figma-tab/30")
                        }
                      >
                        <div
                          className={
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition " +
                            (active
                              ? "border-figma-header bg-figma-header"
                              : "border-ink/20 group-hover:border-figma-header/40")
                          }
                        >
                          {active && (
                            <Check className="h-3 w-3 text-white" strokeWidth={3} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-tajawal text-base font-bold text-figma-text">
                            {s.name}
                          </p>
                          <p className="mt-1 font-tajawal text-xs text-figma-textMut">
                            {s.duration_minutes} دقيقة
                            {s.price
                              ? ` • ${s.price.toLocaleString("ar-EG")} ج.م`
                              : ""}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2 — Date & time */}
          {step === 2 && (
            <motion.div
              key="step-2"
              variants={reduceMotion ? undefined : stepFade}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 font-tajawal text-sm text-figma-textMut transition hover:text-figma-header"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>رجوع</span>
                </button>
                <h2 className="font-tajawal text-lg font-extrabold text-figma-text sm:text-xl">
                  اختر الموعد
                </h2>
              </div>

              {service && (
                <div className="mb-4 rounded-xl bg-white/60 px-4 py-2 font-tajawal text-sm text-figma-text ring-1 ring-ink/10">
                  الخدمة: <span className="font-bold">{service.name}</span>
                </div>
              )}

              <MonthSlotPicker
                slots={serviceSlots}
                selected={slot}
                onSelect={(s) => {
                  setSlot(s);
                  setStep(3);
                }}
              />
            </motion.div>
          )}

          {/* STEP 3 — Details & confirm */}
          {step === 3 && service && slot && (
            <motion.div
              key="step-3"
              variants={reduceMotion ? undefined : stepFade}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 font-tajawal text-sm text-figma-textMut transition hover:text-figma-header"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>رجوع</span>
                </button>
                <h2 className="font-tajawal text-lg font-extrabold text-figma-text sm:text-xl">
                  تفاصيل الحجز
                </h2>
              </div>

              <DetailsStep
                service={service}
                slot={slot}
                name={name}
                phone={phone}
                notes={notes}
                onChangeName={setName}
                onChangePhone={setPhone}
                onChangeNotes={setNotes}
                onConfirm={confirm}
                submitting={submitting}
                error={error}
                canSubmit={canSubmit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky summary */}
      <AnimatePresence>
        {service && slot && (
          <BookingSummary
            service={service}
            slot={slot}
            onEdit={() => setStep(2)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
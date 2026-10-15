"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Service, Slot } from "./BookingFlow";
import { digitsOnly, formatEgPhone, isValidEgPhone } from "@/lib/phone";

interface Props {
  service: Service;
  slot: Slot | null;
  name: string;
  phone: string;
  notes: string;
  onChangeName: (v: string) => void;
  onChangePhone: (v: string) => void;
  onChangeNotes: (v: string) => void;
  onBack?: () => void;
  onConfirm: () => void;
  submitting: boolean;
  error: string | null;
  canSubmit: boolean;
}

export function DetailsStep({
  service,
  slot,
  name,
  phone,
  notes,
  onChangeName,
  onChangePhone,
  onChangeNotes,
  onConfirm,
  submitting,
  error,
  canSubmit,
}: Props) {
  const reduceMotion = useReducedMotion();

  const slotDate = slot ? new Date(slot.start_at) : null;

  const slotLabel = slotDate
    ? `${slotDate.toLocaleDateString("ar-EG", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })} — ${slotDate.toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    : "";

  const phoneDigits = digitsOnly(phone);
  const phoneValid = isValidEgPhone(phoneDigits);
  const phoneError =
    phoneDigits.length > 0 && phoneDigits.length < 11
      ? "رقم الهاتف يجب أن يكون 11 رقم"
      : phoneDigits.length === 11 && !phoneValid
      ? "رقم غير صحيح (يبدأ بـ 01)"
      : null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onConfirm();
      }}
      className="space-y-4"
    >
      {/* ═══════ Row 1: Name + Phone ═══════ */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="الاسم">
          <input
            type="text"
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder="محمد أحمد"
            autoComplete="name"
            className="h-12 w-full rounded-xl border border-ink/10 bg-white px-4 font-tajawal text-base text-figma-text transition focus:border-figma-header focus:outline-none focus:ring-2 focus:ring-figma-header/30"
          />
        </Field>

        <Field label="الهاتف">
          <div className="relative">
            <input
              type="tel"
              inputMode="numeric"
              value={formatEgPhone(phone)}
              onChange={(e) => {
                // Sanitize on every change: strip non-digits, cap at 11.
                const raw = e.target.value.replace(/\D+/g, "").slice(0, 11);
                onChangePhone(raw);
              }}
              onPaste={(e) => {
                e.preventDefault();
                const pasted = e.clipboardData.getData("text");
                const raw = pasted.replace(/\D+/g, "").slice(0, 11);
                onChangePhone(raw);
              }}
              placeholder="0101 234 5678"
              autoComplete="tel-national"
              dir="ltr"
              aria-invalid={!!phoneError}
              aria-describedby={phoneError ? "phone-error" : undefined}
              className={
                "h-12 w-full rounded-xl border bg-white px-4 pe-12 font-tajawal text-base text-figma-text transition focus:outline-none focus:ring-2 " +
                (phoneError
                  ? "border-rose-300 focus:border-rose-400 focus:ring-rose-300/40"
                  : "border-ink/10 focus:border-figma-header focus:ring-figma-header/30")
              }
            />

            {/* Live counter / check */}
            <span
              className={
                "pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 font-tajawal text-xs " +
                (phoneValid ? "text-emerald-500" : "text-figma-textMut")
              }
              aria-hidden
            >
              {phoneValid ? "✓" : `${phoneDigits.length}/11`}
            </span>
          </div>

          {phoneError && (
            <p
              id="phone-error"
              className="mt-1 font-tajawal text-xs text-rose-600"
              role="alert"
            >
              {phoneError}
            </p>
          )}
        </Field>
      </div>

      {/* ═══════ Row 2: Readonly الميعاد + الحجز ═══════ */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="المعاد">
          <input
            type="text"
            value={slotLabel || "— لم يتم اختيار موعد —"}
            readOnly
            disabled
            className="h-12 w-full cursor-not-allowed rounded-xl border border-ink/10 bg-white/60 px-4 font-tajawal text-sm text-figma-text/80"
          />
        </Field>

        <Field label="الحجز">
          <input
            type="text"
            value={service?.name ?? "— لم يتم اختيار خدمة —"}
            readOnly
            disabled
            className="h-12 w-full cursor-not-allowed rounded-xl border border-ink/10 bg-white/60 px-4 font-tajawal text-sm text-figma-text/80"
          />
        </Field>
      </div>

      {/* ═══════ Notes (optional) ═══════ */}
      <Field label="ملاحظات (اختياري)">
        <textarea
          value={notes}
          onChange={(e) => onChangeNotes(e.target.value)}
          rows={3}
          placeholder="أي تفاصيل تحب أن نعرفها..."
          className="w-full resize-none rounded-xl border border-ink/10 bg-white px-4 py-3 font-tajawal text-sm text-figma-text transition focus:border-figma-header focus:outline-none focus:ring-2 focus:ring-figma-header/30"
        />
      </Field>

      {/* ═══════ Error alert ═══════ */}
      {error && (
        <motion.p
          initial={reduceMotion ? undefined : { opacity: 0, y: -6 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          className="rounded-xl bg-rose-50 px-4 py-2 text-center font-tajawal text-sm text-rose-600 ring-1 ring-rose-200"
          role="alert"
        >
          {error}
        </motion.p>
      )}

      {/* ═══════ Submit ═══════ */}
      <button
        type="submit"
        disabled={!canSubmit || submitting}
        className="h-14 w-full rounded-full bg-figma-header font-tajawal text-lg font-bold text-white shadow-[0_10px_30px_-10px_rgba(251,111,146,0.7)] transition hover:bg-figma-header/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-header/50"
      >
        {submitting ? "جاري تأكيد الحجز..." : "إتمام الحجز"}
      </button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-tajawal text-sm text-figma-text">
        {label}
      </span>
      {children}
    </label>
  );
}
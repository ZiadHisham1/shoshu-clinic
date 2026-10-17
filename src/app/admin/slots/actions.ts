"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

/* ============================================================
   Role gate
   ============================================================ */
async function assertAdmin() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
  if (role !== "admin") {
    throw new Error("NOT_ADMIN");
  }
}

/* ============================================================
   Validation patterns
   ============================================================ */
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

/* ============================================================
   Generate slots in bulk
   ============================================================ */
export interface GenerateInput {
  serviceId: string;
  dateFrom: string;
  dateTo: string;
  timeStart: string;
  timeEnd: string;
  durationMinutes: number;
  /** If true, Saturdays are skipped. Fridays are always skipped. */
  skipSaturday: boolean;
}

export async function generateSlots(input: GenerateInput) {
  try {
    await assertAdmin();

    /* ── Validation ── */
    if (!input?.serviceId) {
      return { ok: false as const, error: "اختر الخدمة" };
    }
    if (!DATE_RE.test(input.dateFrom) || !DATE_RE.test(input.dateTo)) {
      return { ok: false as const, error: "تنسيق التاريخ غير صحيح" };
    }
    if (!TIME_RE.test(input.timeStart) || !TIME_RE.test(input.timeEnd)) {
      return { ok: false as const, error: "تنسيق الوقت غير صحيح" };
    }
    if (!Number.isFinite(input.durationMinutes) || input.durationMinutes <= 0) {
      return { ok: false as const, error: "أدخل مدة صحيحة" };
    }

    const from = new Date(`${input.dateFrom}T00:00:00`);
    const to = new Date(`${input.dateTo}T00:00:00`);

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return { ok: false as const, error: "تاريخ غير صحيح" };
    }
    if (from > to) {
      return { ok: false as const, error: "تاريخ البداية بعد تاريخ النهاية" };
    }

    const [startH, startM] = input.timeStart.split(":").map(Number);
    const [endH, endM] = input.timeEnd.split(":").map(Number);

    if ([startH, startM, endH, endM].some((n) => !Number.isFinite(n))) {
      return { ok: false as const, error: "وقت غير صحيح" };
    }

    const durationMs = input.durationMinutes * 60 * 1000;

    /* ── Build rows ── */
    const rows: { service_id: string; start_at: string; end_at: string }[] = [];

    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
      // Friday is always skipped (weekend)  
      if (d.getDay() === 5) continue;

      // Saturday is allowed by default; only skipped if explicitly requested
      if (input.skipSaturday && d.getDay() === 6) continue;

      const dayStart = new Date(d);
      dayStart.setHours(startH, startM, 0, 0);

      const dayEnd = new Date(d);
      dayEnd.setHours(endH, endM, 0, 0);

      for (
        let t = dayStart.getTime();
        t + durationMs <= dayEnd.getTime();
        t += durationMs
      ) {
        rows.push({
          service_id: input.serviceId,
          start_at: new Date(t).toISOString(),
          end_at: new Date(t + durationMs).toISOString(),
        });
      }
    }

    if (rows.length === 0) {
      return {
        ok: false as const,
        error: "لم يتم إنشاء أي مواعيد بهذه الإعدادات",
      };
    }

    if (rows.length > 2000) {
      return {
        ok: false as const,
        error: `عدد المواعيد كبير جداً (${rows.length}). قلل النطاق.`,
      };
    }

    /* ── Insert in chunks ── */
    const supabase = createAdminClient();
    const CHUNK = 500;

    for (let i = 0; i < rows.length; i += CHUNK) {
      const chunk = rows.slice(i, i + CHUNK);
      const { error } = await supabase.from("slots").upsert(chunk, {
        onConflict: "service_id,start_at",
        ignoreDuplicates: true,
      });

      if (error) {
        console.error("[generateSlots] chunk", i, error);
        return { ok: false as const, error: error.message };
      }
    }

    revalidatePath("/admin/slots");
    revalidatePath("/booking");

    return { ok: true as const, inserted: rows.length };
  } catch (e) {
    console.error("[generateSlots] unexpected:", e);
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : "خطأ غير متوقع",
    };
  }
}

/* ============================================================
   Verify slots exist in DB for a range
   ============================================================ */
export async function verifySlots(input: {
  serviceId: string;
  dateFrom: string;
  dateTo: string;
}) {
  try {
    await assertAdmin();

    if (!DATE_RE.test(input.dateFrom) || !DATE_RE.test(input.dateTo)) {
      return { ok: false as const, error: "تنسيق التاريخ غير صحيح", count: 0 };
    }

    const fromIso = new Date(`${input.dateFrom}T00:00:00`).toISOString();
    const toIso = new Date(`${input.dateTo}T23:59:59`).toISOString();

    const supabase = createAdminClient();

    const { count, error } = await supabase
      .from("slots")
      .select("*", { count: "exact", head: true })
      .eq("service_id", input.serviceId)
      .gte("start_at", fromIso)
      .lte("start_at", toIso);

    if (error) {
      console.error("[verifySlots]", error);
      return { ok: false as const, error: error.message, count: 0 };
    }

    return { ok: true as const, count: count ?? 0 };
  } catch (e) {
    console.error("[verifySlots] unexpected:", e);
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : "خطأ غير متوقع",
      count: 0,
    };
  }
}

/* ============================================================
   Delete a single slot
   ============================================================ */
export async function deleteSlot(slotId: string) {
  try {
    await assertAdmin();
    if (!slotId) return { ok: false as const, error: "معرف مفقود" };

    const supabase = createAdminClient();
    const { error } = await supabase.from("slots").delete().eq("id", slotId);

    if (error) {
      console.error("[deleteSlot]", error);
      return { ok: false as const, error: error.message };
    }

    revalidatePath("/admin/slots");
    revalidatePath("/booking");
    return { ok: true as const };
  } catch (e) {
    console.error("[deleteSlot] unexpected:", e);
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : "خطأ غير متوقع",
    };
  }
}

/* ============================================================
   Bulk delete slots by date range
   ============================================================ */
export async function deleteSlotsRange(input: {
  serviceId?: string;
  dateFrom: string;
  dateTo: string;
  onlyUnbooked: boolean;
}) {
  try {
    await assertAdmin();

    if (!DATE_RE.test(input.dateFrom) || !DATE_RE.test(input.dateTo)) {
      return { ok: false as const, error: "تنسيق التاريخ غير صحيح" };
    }

    const fromIso = new Date(`${input.dateFrom}T00:00:00`).toISOString();
    const toIso = new Date(`${input.dateTo}T23:59:59`).toISOString();

    const supabase = createAdminClient();

    let query = supabase
      .from("slots")
      .delete()
      .gte("start_at", fromIso)
      .lte("start_at", toIso);

    if (input.serviceId) query = query.eq("service_id", input.serviceId);
    if (input.onlyUnbooked) query = query.eq("is_booked", false);

    const { error } = await query;

    if (error) {
      console.error("[deleteSlotsRange]", error);
      return { ok: false as const, error: error.message };
    }

    revalidatePath("/admin/slots");
    revalidatePath("/booking");
    return { ok: true as const };
  } catch (e) {
    console.error("[deleteSlotsRange] unexpected:", e);
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : "خطأ غير متوقع",
    };
  }
}

/* ============================================================
   Update booking status (from admin table row actions)
   ============================================================ */
export type BookingStatus = "confirmed" | "completed" | "cancelled";

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
) {
  try {
    await assertAdmin();

    if (!bookingId) {
      return { ok: false as const, error: "معرف الحجز مفقود" };
    }
    if (!["confirmed", "completed", "cancelled"].includes(status)) {
      return { ok: false as const, error: "حالة غير صحيحة" };
    }

    const supabase = createAdminClient();

    // Cancelled → release the slot
    if (status === "cancelled") {
      const { data: row } = await supabase
        .from("bookings")
        .select("slot_id")
        .eq("id", bookingId)
        .single();

      if (row?.slot_id) {
        await supabase
          .from("slots")
          .update({ is_booked: false })
          .eq("id", row.slot_id);
      }
    }

    // Confirmed/completed → re-lock the slot
    if (status === "confirmed" || status === "completed") {
      const { data: row } = await supabase
        .from("bookings")
        .select("slot_id")
        .eq("id", bookingId)
        .single();

      if (row?.slot_id) {
        await supabase
          .from("slots")
          .update({ is_booked: true })
          .eq("id", row.slot_id);
      }
    }

    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", bookingId);

    if (error) {
      console.error("[updateBookingStatus]", error);
      return { ok: false as const, error: error.message };
    }

    revalidatePath("/admin/bookings");
    revalidatePath("/admin/slots");
    revalidatePath("/booking");

    return { ok: true as const };
  } catch (e) {
    console.error("[updateBookingStatus] unexpected:", e);
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : "خطأ غير متوقع",
    };
  }
}
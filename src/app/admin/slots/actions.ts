"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

/* ============================================================
   Role gates
   ============================================================ */
async function getRole() {
  const { sessionClaims } = await auth();
  return (sessionClaims?.metadata as { role?: string } | undefined)?.role;
}

async function assertAdmin() {
  const role = await getRole();
  if (role !== "admin") throw new Error("NOT_ADMIN");
}

async function assertAdminOrManager() {
  const role = await getRole();
  if (role !== "admin" && role !== "manager") {
    throw new Error("NOT_AUTHORIZED");
  }
}

/* ============================================================
   Validation patterns
   ============================================================ */
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

/* ============================================================
   Generate slots (generic time grid)
   ============================================================ */
export interface GenerateInput {
  dateFrom: string;
  dateTo: string;
  timeStart: string;
  timeEnd: string;
  intervalMinutes: number;
  skipSaturday: boolean;
}

export async function generateSlots(input: GenerateInput) {
  try {
    await assertAdmin();

    if (!DATE_RE.test(input.dateFrom) || !DATE_RE.test(input.dateTo)) {
      return { ok: false as const, error: "تنسيق التاريخ غير صحيح" };
    }
    if (!TIME_RE.test(input.timeStart) || !TIME_RE.test(input.timeEnd)) {
      return { ok: false as const, error: "تنسيق الوقت غير صحيح" };
    }

    const from = new Date(`${input.dateFrom}T00:00:00`);
    const to = new Date(`${input.dateTo}T00:00:00`);

    const [startH, startM] = input.timeStart.split(":").map(Number);
    const [endH, endM] = input.timeEnd.split(":").map(Number);

    const supabase = createAdminClient();
    const fromIso = new Date(`${input.dateFrom}T00:00:00`).toISOString();
    const toIso = new Date(`${input.dateTo}T23:59:59`).toISOString();

    const { data: existingSlots } = await supabase
      .from("slots")
      .select("start_at")
      .gte("start_at", fromIso)
      .lte("start_at", toIso);

    const existingStarts = new Set(
      (existingSlots ?? []).map((s) => new Date(s.start_at).getTime())
    );

    const intervalMs = input.intervalMinutes * 60 * 1000;
    const candidates: { start_at: string; end_at: string }[] = [];
    let skipped = 0;

    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
      if (d.getDay() === 5) continue; // Skip Friday
      if (input.skipSaturday && d.getDay() === 6) continue;

      const dayStart = new Date(d);
      dayStart.setHours(startH, startM, 0, 0);
      const dayEnd = new Date(d);
      dayEnd.setHours(endH, endM, 0, 0);

      for (
        let t = dayStart.getTime();
        t + intervalMs <= dayEnd.getTime();
        t += intervalMs
      ) {
        if (existingStarts.has(t)) {
          skipped++;
          continue;
        }
        candidates.push({
          start_at: new Date(t).toISOString(),
          end_at: new Date(t + intervalMs).toISOString(),
        });
      }
    }

    if (candidates.length === 0) {
      return { ok: false as const, error: "لم يتم إنشاء أي مواعيد جديدة" };
    }

    const CHUNK = 500;
    for (let i = 0; i < candidates.length; i += CHUNK) {
      const chunk = candidates.slice(i, i + CHUNK);
      const { error } = await supabase.from("slots").upsert(chunk, {
        onConflict: "start_at",
        ignoreDuplicates: true,
      });
      if (error) throw new Error(error.message);
    }

    revalidatePath("/admin/slots");
    revalidatePath("/booking");

    return {
      ok: true as const,
      inserted: candidates.length,
      skipped,
    };
  } catch (e) {
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
      .gte("start_at", fromIso)
      .lte("start_at", toIso);

    if (error) {
      return { ok: false as const, error: error.message, count: 0 };
    }

    return { ok: true as const, count: count ?? 0 };
  } catch (e) {
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
      return { ok: false as const, error: error.message };
    }

    revalidatePath("/admin/slots");
    revalidatePath("/booking");
    return { ok: true as const };
  } catch (e) {
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

    if (input.onlyUnbooked) query = query.eq("is_booked", false);

    const { error } = await query;

    if (error) {
      return { ok: false as const, error: error.message };
    }

    revalidatePath("/admin/slots");
    revalidatePath("/booking");
    return { ok: true as const };
  } catch (e) {
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : "خطأ غير متوقع",
    };
  }
}

/* ============================================================
   Update booking status
   ============================================================ */
export type BookingStatus = "confirmed" | "completed" | "cancelled";

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
) {
  try {
    await assertAdminOrManager();

    if (!bookingId) {
      return { ok: false as const, error: "معرف الحجز مفقود" };
    }
    if (!["confirmed", "completed", "cancelled"].includes(status)) {
      return { ok: false as const, error: "حالة غير صحيحة" };
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", bookingId);

    if (error) {
      return { ok: false as const, error: error.message };
    }

    revalidatePath("/admin/bookings");
    revalidatePath("/admin/slots");
    revalidatePath("/booking");

    return { ok: true as const };
  } catch (e) {
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : "خطأ غير متوقع",
    };
  }
}
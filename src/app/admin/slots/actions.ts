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
   Generate slots in bulk
   ============================================================ */
export interface GenerateInput {
  serviceId: string;
  dateFrom: string;   // YYYY-MM-DD
  dateTo: string;     // YYYY-MM-DD
  timeStart: string;  // HH:MM (24h)
  timeEnd: string;    // HH:MM
  durationMinutes: number;
  skipWeekends: boolean;
}

export async function generateSlots(input: GenerateInput) {
  await assertAdmin();

  const supabase = createAdminClient();

  const slots: { service_id: string; start_at: string; end_at: string }[] = [];

  const from = new Date(`${input.dateFrom}T00:00:00`);
  const to = new Date(`${input.dateTo}T00:00:00`);

  if (from > to) {
    return { ok: false, error: "تاريخ البداية بعد تاريخ النهاية" };
  }

  const [startH, startM] = input.timeStart.split(":").map(Number);
  const [endH, endM] = input.timeEnd.split(":").map(Number);
  const durationMs = input.durationMinutes * 60 * 1000;

  for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
    // Skip weekends (Fri=5, Sat=6 for Egypt)
    if (input.skipWeekends) {
      const day = d.getDay();
      if (day === 5 || day === 6) continue;
    }

    const dayStart = new Date(d);
    dayStart.setHours(startH, startM, 0, 0);
    const dayEnd = new Date(d);
    dayEnd.setHours(endH, endM, 0, 0);

    for (let t = dayStart.getTime(); t + durationMs <= dayEnd.getTime(); t += durationMs) {
      slots.push({
        service_id: input.serviceId,
        start_at: new Date(t).toISOString(),
        end_at: new Date(t + durationMs).toISOString(),
      });
    }
  }

  if (slots.length === 0) {
    return { ok: false, error: "لم يتم إنشاء أي مواعيد بهذه الإعدادات" };
  }

  const { error, count } = await supabase
    .from("slots")
    .upsert(slots, {
      onConflict: "service_id,start_at",
      ignoreDuplicates: true,
      count: "exact",
    });

  if (error) {
    console.error("[generateSlots]", error);
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/slots");
  revalidatePath("/booking");

  return { ok: true, inserted: count ?? slots.length };
}

/* ============================================================
   Delete a single slot
   ============================================================ */
export async function deleteSlot(slotId: string) {
  await assertAdmin();

  const supabase = createAdminClient();
  const { error } = await supabase.from("slots").delete().eq("id", slotId);

  if (error) {
    console.error("[deleteSlot]", error);
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/slots");
  revalidatePath("/booking");
  return { ok: true };
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
  await assertAdmin();

  const supabase = createAdminClient();

  const fromIso = new Date(`${input.dateFrom}T00:00:00`).toISOString();
  const toIso = new Date(`${input.dateTo}T23:59:59`).toISOString();

  let query = supabase
    .from("slots")
    .delete()
    .gte("start_at", fromIso)
    .lte("start_at", toIso);

  if (input.serviceId) query = query.eq("service_id", input.serviceId);
  if (input.onlyUnbooked) query = query.eq("is_booked", false);

  const { error, count } = await query;

  if (error) {
    console.error("[deleteSlotsRange]", error);
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/slots");
  revalidatePath("/booking");
  return { ok: true, deleted: count ?? 0 };
}

/* ============================================================
   Update booking status (from admin table row actions)
   ============================================================ */
export type BookingStatus = "confirmed" | "completed" | "cancelled";

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<{ ok: true } | { ok: false; error: string }> {
  await assertAdmin();

  if (!bookingId) return { ok: false, error: "معرف الحجز مفقود" };
  if (!["confirmed", "completed", "cancelled"].includes(status)) {
    return { ok: false, error: "حالة غير صحيحة" };
  }

  const supabase = createAdminClient();

  // If cancelling, free the slot so it becomes bookable again.
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

  // If moving from cancelled back to confirmed/completed, re-lock the slot.
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
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/slots");
  revalidatePath("/booking");

  return { ok: true };
}
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slot_id, customer_name, customer_phone, notes } = body;

    if (!slot_id || !customer_name || !customer_phone) {
      return NextResponse.json(
        { error: "MISSING_FIELDS", message: "بيانات ناقصة" },
        { status: 400 }
      );
    }

    const { getToken } = await auth();
    const token = await getToken({ template: "supabase" }).catch(() => null);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      }
    );

    // 1. Create the booking via RPC
    const { data, error } = await supabase.rpc("book_slot", {
      p_slot_id: slot_id,
      p_customer_name: customer_name,
      p_customer_phone: customer_phone,
      p_notes: notes ?? null,
    });

    if (error) {
      const msg = error.message ?? "";
      if (msg.includes("SLOT_ALREADY_BOOKED")) {
        return NextResponse.json(
          { error: "SLOT_ALREADY_BOOKED", message: "الموعد محجوز" },
          { status: 409 }
        );
      }
      if (msg.includes("SLOT_NOT_FOUND")) {
        return NextResponse.json(
          { error: "SLOT_NOT_FOUND", message: "الموعد غير موجود" },
          { status: 404 }
        );
      }
      console.error("[bookings/create]", error);
      return NextResponse.json(
        { error: "DB_ERROR", message: error.message },
        { status: 500 }
      );
    }

    // 2. Re-fetch with joins so we can build a rich WhatsApp message
    const bookingId = (data as { id: string }).id;

    const { data: enriched } = await supabase
      .from("bookings")
      .select(
        `id, customer_name, customer_phone, notes,
         slot:slots ( start_at, end_at, service:services (name) )`
      )
      .eq("id", bookingId)
      .single();

    // 3. Flatten Supabase's array-wrapped joins
    const slot = Array.isArray(enriched?.slot)
      ? enriched?.slot[0] ?? null
      : enriched?.slot ?? null;

    const service = slot
      ? Array.isArray(slot.service)
        ? slot.service[0] ?? null
        : slot.service
      : null;

    return NextResponse.json({
      booking: {
        id: bookingId,
        customer_name: enriched?.customer_name ?? customer_name,
        customer_phone: enriched?.customer_phone ?? customer_phone,
        notes: enriched?.notes ?? notes ?? null,
        start_at: slot?.start_at ?? null,
        end_at: slot?.end_at ?? null,
        service_name: service?.name ?? null,
      },
    });
  } catch (e) {
    console.error("[bookings/create] failed:", e);
    const message = e instanceof Error ? e.message : "خطأ غير متوقع";
    return NextResponse.json(
      { error: "SERVER_ERROR", message },
      { status: 500 }
    );
  }
} 
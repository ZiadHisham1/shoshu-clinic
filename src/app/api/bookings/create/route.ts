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

    // Try to attach the Clerk user ID if signed in
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

    return NextResponse.json({ booking: data });
  } catch (e: any) {
    console.error("[bookings/create] failed:", e);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: e?.message ?? "خطأ غير متوقع" },
      { status: 500 }
    );
  }
}
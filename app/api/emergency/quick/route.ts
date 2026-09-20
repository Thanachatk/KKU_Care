import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const quickEmergencySchema = z.object({ name: z.string().trim().min(2, "กรุณาระบุชื่อผู้แจ้ง").max(120, "ชื่อยาวเกินไป") });

export async function POST(request: Request) {
  try {
    const input = quickEmergencySchema.safeParse(await request.json());
    if (!input.success) return NextResponse.json({ error: input.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.rpc("create_case", {
      p_reporter_id: user?.id ?? null,
      p_case_kind: "emergency",
      p_title: `รายงานเหตุฉุกเฉินเร่งด่วนจาก ${input.data.name}`,
      p_category: "ฉุกเฉินเร่งด่วน",
      p_description: `ผู้แจ้ง: ${input.data.name} — รายงานเหตุฉุกเฉินเร่งด่วนผ่านแบบฟอร์มด่วน กรุณาติดต่อกลับและตรวจสอบพื้นที่โดยเร็วที่สุด`,
      p_phone: "ไม่ระบุ",
      p_location_name: null,
      p_location_detail: null,
      p_latitude: null,
      p_longitude: null,
    });
    if (error) throw error;
    return NextResponse.json({ tracking_code: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "เกิดข้อผิดพลาดจากระบบ" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { caseSchema } from "@/lib/validation";

type DatabaseError = { code?: string; message?: string };

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const parsed = caseSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    if (!user && parsed.data.case_kind !== "emergency") return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนส่งเรื่องร้องทุกข์" }, { status: 401 });

    const { data, error } = await supabase.rpc("create_case", {
      p_reporter_id: user?.id ?? null,
      p_case_kind: parsed.data.case_kind,
      p_title: parsed.data.title,
      p_category: parsed.data.category,
      p_description: parsed.data.description,
      p_phone: parsed.data.phone,
      p_location_name: parsed.data.location_name ?? null,
      p_location_detail: parsed.data.location_detail ?? null,
      p_latitude: parsed.data.latitude ?? null,
      p_longitude: parsed.data.longitude ?? null,
    });
    if (error) throw error;
    return NextResponse.json({ tracking_code: data });
  } catch (error) {
    console.error("Case submission failed:", error);
    const databaseError = error as DatabaseError;
    if (databaseError.code === "23505") {
      return NextResponse.json({ error: "ระบบสร้างเลขติดตามซ้ำ กรุณาลองส่งเรื่องอีกครั้ง" }, { status: 503 });
    }
    if (databaseError.code === "PGRST202" || databaseError.code === "42883") {
      return NextResponse.json({ error: "ระบบรับเรื่องยังตั้งค่าไม่ครบ กรุณาติดต่อผู้ดูแลระบบ" }, { status: 503 });
    }
    return NextResponse.json({ error: "บันทึกเรื่องไม่สำเร็จ กรุณาลองอีกครั้ง หากยังพบปัญหาให้ติดต่อผู้ดูแลระบบ" }, { status: 500 });
  }
}

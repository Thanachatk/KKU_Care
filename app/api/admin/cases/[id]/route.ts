import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const allowedStatuses = ["received", "under_review", "assigned", "in_progress", "waiting_information", "resolved", "closed", "rejected"];
const allowedPriorities = ["low", "normal", "high", "critical"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle(); if (!profile || !["admin", "staff"].includes(profile.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json() as { status?: string; priority?: string; assigned_agency_id?: string; assigned_staff_id?: string; note?: string };
  const updates: Record<string, string | null> = {}; if (body.status) { if (!allowedStatuses.includes(body.status)) return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 }); updates.status = body.status; } if (body.priority) { if (!allowedPriorities.includes(body.priority)) return NextResponse.json({ error: "Priority ไม่ถูกต้อง" }, { status: 400 }); updates.priority = body.priority; } if (body.assigned_agency_id !== undefined) updates.assigned_agency_id = body.assigned_agency_id || null; if (body.assigned_staff_id !== undefined) updates.assigned_staff_id = body.assigned_staff_id || null; if (!Object.keys(updates).length) return NextResponse.json({ error: "ไม่มีข้อมูลสำหรับบันทึก" }, { status: 400 });
  const { error } = await supabase.from("cases").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id); if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (body.status) { const history = await supabase.from("case_status_history").insert({ case_id: id, status: body.status, note: body.note || "อัปเดตสถานะโดยเจ้าหน้าที่", updated_by: user.id }); if (history.error) return NextResponse.json({ error: history.error.message }, { status: 400 }); }
  return NextResponse.json({ ok: true });
}

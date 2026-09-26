import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { StaffConsole, type Agency, type StaffCase } from "@/components/staff-console";

export default async function Admin() {
  if (!hasSupabaseConfig()) return <main className="container grid min-h-[70vh] place-items-center text-center"><div><h1 className="text-2xl font-bold">ยังไม่ได้เชื่อมต่อ Supabase</h1><p className="mt-2 text-[var(--muted)]">กรุณาเพิ่ม Environment Variables ใน Vercel แล้ว Redeploy</p></div></main>;
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role,full_name").eq("id", user.id).maybeSingle();
  if (!profile || !["admin", "staff"].includes(profile.role)) return <main className="container grid min-h-[70vh] place-items-center text-center"><div><h1 className="text-2xl font-bold">ไม่มีสิทธิ์เข้าถึง</h1><p className="mt-2 text-[var(--muted)]">หน้านี้สำหรับเจ้าหน้าที่เท่านั้น</p></div></main>;
  const [{ data: cases }, { data: agencies }] = await Promise.all([
    supabase.from("cases").select("id,tracking_code,title,category,case_kind,status,priority,location_name,created_at,assigned_agency_id,assigned_staff_id").order("created_at", { ascending: false }).limit(100),
    supabase.from("agencies").select("id,name").eq("is_active", true).order("name"),
  ]);
  return <main className="bg-[var(--bg)] py-8 sm:py-10"><div className="container"><div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold text-[var(--primary)]">STAFF CONSOLE</p><h1 className="text-3xl font-extrabold">สวัสดี {profile.full_name || "เจ้าหน้าที่"}</h1><p className="mt-1 text-[var(--muted)]">ติดตามเรื่องสำคัญและจัดการคำร้องจากจุดเดียว</p></div></div><StaffConsole cases={(cases ?? []) as StaffCase[]} agencies={(agencies ?? []) as Agency[]} /></div></main>;
}

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StaffConsole, type Agency, type StaffCase } from "@/components/staff-console";

export default async function AdminCases() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role,full_name").eq("id", user.id).maybeSingle(); if (!profile || !["admin", "staff"].includes(profile.role)) redirect("/admin");
  const [{ data: cases }, { data: agencies }] = await Promise.all([
    supabase.from("cases").select("id,tracking_code,title,category,case_kind,status,priority,location_name,created_at,assigned_agency_id,assigned_staff_id").order("created_at", { ascending: false }).limit(100),
    supabase.from("agencies").select("id,name").eq("is_active", true).order("name"),
  ]);
  return <main className="bg-[var(--bg)] py-8 sm:py-10"><div className="container"><div className="mb-7"><p className="text-sm font-bold text-[var(--primary)]">CASE MANAGEMENT</p><h1 className="text-3xl font-extrabold">รายการเรื่องร้องเรียน</h1></div><StaffConsole cases={(cases ?? []) as StaffCase[]} agencies={(agencies ?? []) as Agency[]} /></div></main>;
}

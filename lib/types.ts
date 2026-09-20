export type Role = "user" | "staff" | "admin";
export type CaseKind = "emergency" | "complaint";
export type CaseStatus = "received" | "under_review" | "assigned" | "in_progress" | "resolved" | "rejected";
export type CasePriority = "low" | "normal" | "high" | "critical";
export type CaseRecord = { id:string; tracking_code:string; case_kind:CaseKind; title:string; category:string; description:string; phone:string; location_name:string|null; location_detail:string|null; latitude:number|null; longitude:number|null; priority:CasePriority; status:CaseStatus; created_at:string; updated_at:string; resolved_at:string|null; assigned_agency_id:string|null; agencies?:{name:string;phone:string}|null };
export const statusLabels:Record<CaseStatus,string> = { received:"รับเรื่องแล้ว", under_review:"รอตรวจสอบ", assigned:"มอบหมายแล้ว", in_progress:"กำลังดำเนินการ", resolved:"เสร็จสิ้น", rejected:"ไม่รับเรื่อง" };

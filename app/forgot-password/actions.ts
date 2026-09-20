"use server"; import { redirect } from "next/navigation"; import { createClient } from "@/lib/supabase/server";
export async function reset(formData:FormData){const supabase=await createClient();await supabase.auth.resetPasswordForEmail(String(formData.get("email")),{redirectTo:`${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`});redirect("/login?reset=1");}

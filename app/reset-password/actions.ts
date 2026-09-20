"use server"; import { redirect } from "next/navigation"; import { createClient } from "@/lib/supabase/server";
export async function updatePassword(formData:FormData){const supabase=await createClient();await supabase.auth.updateUser({password:String(formData.get("password"))});redirect("/login?updated=1");}

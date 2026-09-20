import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isKkuMail } from "@/lib/auth/email-policy";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("Google Login ไม่สำเร็จ")}`, url.origin));
  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("Google Login ไม่สำเร็จ")}`, url.origin));
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email || !isKkuMail(user.email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("กรุณาใช้ Google Account ของ KKU Mail (@kkumail.com) เท่านั้น")}`, url.origin));
  }
  return NextResponse.redirect(new URL("/", url.origin));
}

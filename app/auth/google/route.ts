import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const url = new URL(request.url);
  const callbackUrl = `${url.origin}/auth/callback`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callbackUrl, queryParams: { access_type: "offline", prompt: "select_account" } },
  });
  if (error || !data.url) return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("ไม่สามารถเชื่อมต่อ Google ได้")}`, url.origin));
  return NextResponse.redirect(data.url);
}

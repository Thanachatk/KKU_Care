import { supabaseEnv } from "./env";
export function hasSupabaseConfig() { return Boolean(supabaseEnv("NEXT_PUBLIC_SUPABASE_URL") && supabaseEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")); }

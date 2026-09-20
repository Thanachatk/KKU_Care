export function supabaseEnv(name: string) {
  const value = process.env[name]?.trim() ?? "";
  return value.replace(/^\"(.*)\"$/, "$1").replace(/^'(.*)'$/, "$1");
}

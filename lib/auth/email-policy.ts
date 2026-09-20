export const KKU_EMAIL_DOMAIN = "@kkumail.com";

export function isKkuMail(email: string) {
  return email.trim().toLowerCase().endsWith(KKU_EMAIL_DOMAIN);
}

import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";

export const metadata: Metadata = { title: "KKU CARE", description: "ระบบแจ้งเหตุ ร้องทุกข์ และติดตามผล มหาวิทยาลัยขอนแก่น" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="th"><body><Header />{children}</body></html>; }

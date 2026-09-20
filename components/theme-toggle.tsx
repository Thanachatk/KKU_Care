"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.dataset.theme === "midnight"), []);
  function toggle() {
    const next = !dark;
    document.documentElement.dataset.theme = next ? "midnight" : "warm";
    setDark(next);
  }
  return <button type="button" onClick={toggle} className="rounded-lg p-2 text-[#78716C] hover:bg-[#F5E7E3]" aria-label={dark ? "เปลี่ยนเป็นธีมสว่าง" : "เปลี่ยนเป็นธีมเข้ม"} title={dark ? "ธีมสว่าง" : "ธีมเข้ม"}>{dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>;
}

"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("kku-care-theme");
    const isDark = savedTheme === "midnight";
    document.documentElement.dataset.theme = isDark ? "midnight" : "warm";
    setDark(isDark);
  }, []);
  function toggle() {
    const next = !dark;
    document.documentElement.dataset.theme = next ? "midnight" : "warm";
    window.localStorage.setItem("kku-care-theme", next ? "midnight" : "warm");
    setDark(next);
  }
  return <button type="button" onClick={toggle} className="theme-toggle rounded-lg p-2" aria-label={dark ? "เปลี่ยนเป็นธีมสว่าง" : "เปลี่ยนเป็นธีมเข้ม"} title={dark ? "ธีมสว่าง" : "ธีมเข้ม"}>{dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>;
}

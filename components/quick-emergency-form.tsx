"use client";

import { useState } from "react";
import { AlertTriangle, Copy, Send } from "lucide-react";

export function QuickEmergencyForm() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [trackingCode, setTrackingCode] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setError("กรุณาพิมพ์ชื่อผู้แจ้ง");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/emergency/quick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "ส่งรายงานไม่สำเร็จ");
      setTrackingCode(result.tracking_code);
      setName("");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  async function copyCode() {
    await navigator.clipboard?.writeText(trackingCode);
  }

  return <section className="card border-red-200 bg-red-50 p-5 sm:p-6" aria-labelledby="quick-emergency-heading">
    <div className="flex items-start gap-3">
      <span className="rounded-xl bg-red-600 p-3 text-white"><AlertTriangle className="h-6 w-6" /></span>
      <div>
        <h2 id="quick-emergency-heading" className="text-xl font-extrabold text-red-900">รายงานเหตุฉุกเฉินเร่งด่วนมาก</h2>
        <p className="mt-1 text-sm text-red-800">กรอกชื่อผู้แจ้งเพียงอย่างเดียว ระบบจะส่งสัญญาณให้เจ้าหน้าที่ทันที</p>
      </div>
    </div>
    {trackingCode ? <div className="mt-5 rounded-xl bg-white p-4 text-center"><p className="text-sm text-[#78716C]">ส่งรายงานแล้ว กรุณาเก็บรหัสติดตาม</p><div className="mt-1 flex items-center justify-center gap-2"><strong className="text-2xl text-[#A73B24]">{trackingCode}</strong><button type="button" onClick={copyCode} className="rounded-lg p-2 text-[#A73B24] hover:bg-[#F5E7E3]" aria-label="คัดลอกรหัสติดตาม"><Copy className="h-4 w-4" /></button></div></div> : <form onSubmit={submit} className="mt-5 flex flex-col gap-3 sm:flex-row"><label className="sr-only" htmlFor="quick-emergency-name">ชื่อผู้แจ้ง</label><input id="quick-emergency-name" value={name} onChange={(event) => setName(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-red-200 bg-white px-3 py-3" placeholder="พิมพ์ชื่อผู้แจ้ง" maxLength={120} /><button className="btn btn-danger" disabled={loading}><Send className="h-4 w-4" />{loading ? "กำลังส่ง..." : "ส่งเรื่องทันที"}</button></form>}
    {error && <p className="mt-3 text-sm font-semibold text-red-700" role="alert">{error}</p>}
    <p className="mt-3 text-xs text-red-700">หากมีผู้บาดเจ็บหรือมีอันตรายทันที กรุณาโทร 191 หรือ 1669 ควบคู่กัน</p>
  </section>;
}

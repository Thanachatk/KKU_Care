# KKU CARE

ระบบแจ้งเหตุฉุกเฉิน ส่งเรื่องร้องทุกข์ และติดตามสถานะสำหรับมหาวิทยาลัยขอนแก่น สร้างด้วย Next.js App Router, TypeScript, Tailwind CSS และ Supabase

## เริ่มต้นใช้งาน

1. ติดตั้ง Node.js LTS แล้วรัน `npm install`
2. สร้าง Supabase Project และคัดลอกค่า URL/Anon Key/Service Role Key ลง `.env.local` ตาม `.env.example`
3. เปิด Supabase SQL Editor แล้วรันไฟล์ `supabase/migrations/001_initial.sql`
4. รัน `npm run dev` แล้วเปิด `http://localhost:3000`

## ตั้งค่า Supabase และสิทธิ์

Migration จะสร้างตาราง, enum, index, trigger สร้าง profile, function สร้าง Tracking Code แบบมี lock, RLS และข้อมูลหน่วยงานเริ่มต้นให้แล้ว ผู้ใช้ใหม่จะเป็น `user` เสมอ หากต้องการ Promote ผู้ใช้เป็น Admin ให้สมัครสมาชิกก่อน แล้วรันบน SQL Editor:

```sql
update public.profiles p set role='admin'
from auth.users u where p.id=u.id and u.email='admin@example.com';
```

สำหรับ Storage ให้สร้าง private bucket ชื่อ `case-attachments` และเพิ่ม policy ให้เฉพาะเจ้าของคำร้อง/เจ้าหน้าที่ที่ได้รับมอบหมายอ่านไฟล์ได้ โดย upload ผ่าน server route เท่านั้น

## Deploy บน Vercel

Import repository เข้า Vercel แบบ Next.js แล้วเพิ่ม Environment Variables ทั้งชุดจาก `.env.example` ใน Development, Preview และ Production จากนั้นตั้ง Supabase Authentication URL Configuration เป็น Production URL และเพิ่ม `http://localhost:3000/**`, Preview URL และ Production URL เป็น Redirect URLs

ก่อน deploy รัน `npm run lint`, `npm run typecheck`, `npm run test` และ `npm run build`

## หมายเหตุความปลอดภัย

`SUPABASE_SERVICE_ROLE_KEY` ใช้เฉพาะ Server เท่านั้น ห้ามใส่ prefix `NEXT_PUBLIC_` และห้าม commit `.env.local` ระบบตรวจ session/role ที่ server และใช้ RLS เป็นชั้นป้องกันข้อมูลหลัก

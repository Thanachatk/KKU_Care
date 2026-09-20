-- KKU CARE Demo Data
-- ใช้สำหรับเติมข้อมูลตัวอย่างในหน้าข่าวสารและ Admin Dashboard เท่านั้น
-- ลบข้อมูลชุดนี้ได้ด้วยคำสั่งท้ายไฟล์

insert into public.announcements (id, title, content, published_at, is_published)
values
  ('d0000000-0000-4000-8000-000000000001', 'แจ้งปรับเส้นทางเดินรถภายในมหาวิทยาลัย', 'ขอความร่วมมือผู้ใช้รถใช้เส้นทางสำรองบริเวณวงเวียนหอสมุดในช่วงปรับปรุงพื้นผิวถนน', now() - interval '2 days', true),
  ('d0000000-0000-4000-8000-000000000002', 'ช่องทางติดต่อหน่วยรักษาความปลอดภัย มข.', 'สายด่วน 043-202-191 พร้อมให้บริการตลอด 24 ชั่วโมง สำหรับเหตุเร่งด่วนภายในมหาวิทยาลัย', now() - interval '5 days', true),
  ('d0000000-0000-4000-8000-000000000003', 'แจ้งปิดระบบไฟฟ้าชั่วคราว อาคาร SC', 'ประกาศปิดระบบไฟฟ้าชั่วคราวเพื่อบำรุงรักษา โปรดวางแผนการใช้งานล่วงหน้า', now() - interval '8 days', true)
on conflict (id) do update set title=excluded.title, content=excluded.content, published_at=excluded.published_at, is_published=excluded.is_published;

insert into public.cases (id, tracking_code, reporter_id, case_kind, title, category, description, phone, location_name, location_detail, priority, status, assigned_agency_id, created_at, updated_at)
values
  ('d1000000-0000-4000-8000-000000000001', 'DEMO-2026-00001', null, 'complaint', '[DEMO] ฝาท่อชำรุดหน้าอาคาร SC.09', 'อาคารและสถานที่', 'พบฝาท่อชำรุดบริเวณทางเดินหน้าอาคาร SC.09 อาจก่อให้เกิดอันตรายต่อผู้สัญจร', '0000000000', 'อาคาร SC.09', 'หน้าทางเข้าฝั่งลานจอดรถ', 'high', 'in_progress', (select id from public.agencies where name='กองอาคารและสถานที่' limit 1), now() - interval '1 day', now() - interval '3 hours'),
  ('d1000000-0000-4000-8000-000000000002', 'DEMO-2026-00002', null, 'emergency', '[DEMO] ขอความช่วยเหลือบริเวณลานจอดรถ', 'ฉุกเฉินเร่งด่วน', 'รายงานเหตุเพื่อทดสอบระบบรับแจ้งเหตุและการแจ้งเตือนเจ้าหน้าที่', '0000000000', 'ลานจอดรถคณะวิทยาศาสตร์', 'ใกล้ทางออกด้านทิศตะวันตก', 'critical', 'received', (select id from public.agencies where name='กองป้องกันและรักษาความปลอดภัย มข.' limit 1), now() - interval '4 hours', now() - interval '4 hours'),
  ('d1000000-0000-4000-8000-000000000003', 'DEMO-2026-00003', null, 'complaint', '[DEMO] ไฟส่องสว่างบริเวณทางเดินดับ', 'สาธารณูปโภค', 'ไฟส่องสว่างบริเวณทางเดินระหว่างอาคารดับหลายจุด', '0000000000', 'อาคารเรียนรวม', 'ทางเดินด้านหลังอาคาร', 'normal', 'resolved', (select id from public.agencies where name='กองอาคารและสถานที่' limit 1), now() - interval '12 days', now() - interval '2 days')
on conflict (id) do update set title=excluded.title, status=excluded.status, priority=excluded.priority, assigned_agency_id=excluded.assigned_agency_id, updated_at=excluded.updated_at;

insert into public.case_status_history (id, case_id, status, note, created_at)
values
  ('d2000000-0000-4000-8000-000000000001', 'd1000000-0000-4000-8000-000000000001', 'received', 'รับเรื่องตัวอย่างเข้าสู่ระบบ', now() - interval '1 day'),
  ('d2000000-0000-4000-8000-000000000002', 'd1000000-0000-4000-8000-000000000001', 'in_progress', 'อยู่ระหว่างประสานงานหน่วยงานที่เกี่ยวข้อง', now() - interval '3 hours'),
  ('d2000000-0000-4000-8000-000000000003', 'd1000000-0000-4000-8000-000000000002', 'received', 'รับแจ้งเหตุฉุกเฉินตัวอย่างแล้ว', now() - interval '4 hours'),
  ('d2000000-0000-4000-8000-000000000004', 'd1000000-0000-4000-8000-000000000003', 'received', 'รับเรื่องและตรวจสอบข้อมูล', now() - interval '12 days'),
  ('d2000000-0000-4000-8000-000000000005', 'd1000000-0000-4000-8000-000000000003', 'resolved', 'ดำเนินการแก้ไขและตรวจสอบเรียบร้อยแล้ว', now() - interval '2 days')
on conflict (id) do update set status=excluded.status, note=excluded.note, created_at=excluded.created_at;

-- ลบ Demo Data หากต้องการคืนฐานข้อมูลให้เหลือเฉพาะข้อมูลจริง
-- delete from public.case_status_history where id in ('d2000000-0000-4000-8000-000000000001','d2000000-0000-4000-8000-000000000002','d2000000-0000-4000-8000-000000000003','d2000000-0000-4000-8000-000000000004','d2000000-0000-4000-8000-000000000005');
-- delete from public.cases where id in ('d1000000-0000-4000-8000-000000000001','d1000000-0000-4000-8000-000000000002','d1000000-0000-4000-8000-000000000003');
-- delete from public.announcements where id in ('d0000000-0000-4000-8000-000000000001','d0000000-0000-4000-8000-000000000002','d0000000-0000-4000-8000-000000000003');

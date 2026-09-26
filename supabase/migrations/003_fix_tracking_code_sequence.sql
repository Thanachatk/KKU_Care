-- Repair Tracking ID generation for existing projects.
-- The sequence is extracted from the fixed-width numeric suffix, avoiding
-- regex escape differences between SQL strings and the PostgreSQL regex engine.
create or replace function public.create_case(
  p_reporter_id uuid,
  p_case_kind public.case_kind,
  p_title text,
  p_category text,
  p_description text,
  p_phone text,
  p_location_name text,
  p_location_detail text,
  p_latitude double precision,
  p_longitude double precision
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  seq bigint;
  code text;
  new_id uuid;
  prefix text;
  year_text text := to_char(now(), 'YYYY');
begin
  if p_reporter_id is not null and p_reporter_id <> auth.uid() then
    raise exception 'invalid reporter';
  end if;

  prefix := case when p_case_kind = 'emergency' then 'EMG' else 'KKU' end;
  perform pg_advisory_xact_lock(hashtext(prefix || year_text));

  select coalesce(max(right(tracking_code, 5)::bigint), 0) + 1
    into seq
    from public.cases
   where tracking_code like prefix || '-' || year_text || '-%';

  code := format('%s-%s-%s', prefix, year_text, lpad(seq::text, 5, '0'));

  insert into public.cases(
    tracking_code, reporter_id, case_kind, title, category, description,
    phone, location_name, location_detail, latitude, longitude
  ) values (
    code, p_reporter_id, p_case_kind, p_title, p_category, p_description,
    p_phone, p_location_name, p_location_detail, p_latitude, p_longitude
  ) returning id into new_id;

  insert into public.case_status_history(case_id, status, updated_by)
  values (new_id, 'received', auth.uid());

  return code;
end;
$$;

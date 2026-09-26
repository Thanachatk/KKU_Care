-- Staff Console upgrade: statuses used by the operational workflow.
alter type public.case_status add value if not exists 'waiting_information';
alter type public.case_status add value if not exists 'closed';

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.reject_shared_goal(_goal_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
    _share_record public.share_records;
begin
    select sr.*
    into _share_record
    from public.share_records sr
    where sr.goal = _goal_id
      and sr.shared_with = auth.uid();

    if not found then
        raise exception 'Shared goal with id: % not found or you do not have permission to reject it', _goal_id;
    end if;

    if _share_record.status != 'pending' then
        raise exception 'Cannot reject a shared goal with non pending status: %', _share_record.status;
    end if;

    update public.share_records
    set status = 'rejected'
    where id = _share_record.id;
end;
$function$
;




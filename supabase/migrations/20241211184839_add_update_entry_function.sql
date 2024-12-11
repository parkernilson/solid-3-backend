set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_entry(_entry_id uuid, _text_content text, _success boolean, _date_of date)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
    if exists(select 1
              from public.goals g
                       join public.entries e on g.id = e.goal and g.owner = auth.uid()) then
        update public.entries set text_content = _text_content, success = _success, date_of = _date_of where id = _entry_id;
    else
        raise exception 'The entry with id % does not exist or you do not have access to modify it.', _entry_id;
    end if;
end;
$function$
;




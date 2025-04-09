set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.delete_entry(_entry_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
    if exists(select 1
              from public.goals g
                       join public.entries e on g.id = e.goal and g.owner = auth.uid()) then
        delete from public.entries where id = _entry_id;
    else
        raise exception 'The entry % does not exist or you do not have access to delete it.', _entry_id;
    end if;
end;
$function$
;




drop function if exists "public"."upsert_entry"(_goal_id uuid, _entry_id uuid, _success boolean, _text_content text, _date_of date);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_entry(_goal_id uuid, _success boolean, _date_of date, _text_content text default null)
 RETURNS entries
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
    created_entry public.entries;
begin
    if exists(select 1 from public.goals g where g.owner = auth.uid()) then
        insert into public.entries (goal, text_content, success, date_of)
        values (_goal_id, _text_content, _success, _date_of)
        returning * into created_entry;

        return created_entry;
    else
        raise exception 'The goal % does not exist or you do not have access to create entries on it.', _goal_id;
    end if;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_entry(_entry_id uuid, _text_content text DEFAULT NULL::text, _success boolean DEFAULT NULL::boolean, _date_of date DEFAULT NULL::date)
 RETURNS entries
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
    updated_entry public.entries;
begin
    if exists(select 1
              from public.goals g
                       join public.entries e on g.id = e.goal and g.owner = auth.uid()) then
        update entries
        set text_content = _text_content and success = _success and date_of = _date_of
        where id = _entry_id
        returning * into updated_entry;

        return updated_entry;
    else
        raise exception 'The entry with id % does not exist or you do not have access to modify it.', _entry_id;
    end if;
end;
$function$
;




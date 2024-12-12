drop function if exists "public"."create_entry"(_goal_id uuid, _success boolean, _text_content text);

drop function if exists "public"."update_entry"(_entry_id uuid, _text_content text, _success boolean, _date_of date);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.upsert_entry(_goal_id uuid, _entry_id uuid DEFAULT NULL::uuid, _success boolean DEFAULT true, _text_content text DEFAULT NULL::text, _date_of date DEFAULT CURRENT_DATE)
 RETURNS entries
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
    -- Fetch the goal and check ownership
    if _entry_id is not null then
        if not exists(select 1
                      from public.entries e
                               join public.goals g on g.id = _goal_id and e.goal = g.id and g.owner = auth.uid()) then
            raise exception 'Entry with id % for goal with id % not found or you do not have permission to modify it', _entry_id, _goal_id;
        end if;
    else
        if not exists(
            select 1 from public.goals g where g.id = _goal_id and g.owner = auth.uid()
        ) then
            raise exception 'Goal with id % not found or you do not have permission to add an entry to it', _goal_id;
        end if;
    end if;

    if _date_of > current_date then
        raise exception 'Date cannot be in the future: %', _date_of;
    end if;

    insert into public.entries (id, goal, text_content, success, date_of)
    values (_entry_id, _goal_id, _text_content, _success, _date_of)
    on conflict (id) do update
    set
        text_content = _text_content,
        success = _success,
        date_of = _date_of
    returning *;

END;
$function$
;




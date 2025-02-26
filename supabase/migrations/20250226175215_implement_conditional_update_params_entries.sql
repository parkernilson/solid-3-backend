drop function if exists "public"."update_entry"(_entry_id uuid, _text_content text, _success boolean, _date_of date);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.conditional_update_params(set_vals json, permitted_key_to_col_map json)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
declare
    params_text  text   := '';
    separator    text   := '';
    key_val      text;
    col_name     text;
    invalid_keys text[] := '{}';
begin

    select array_agg(sk)
    into invalid_keys
    from json_object_keys(set_vals) sk
    where sk not in (select * from json_object_keys(permitted_key_to_col_map));

    if array_length(invalid_keys, 1) > 0 then
        raise exception 'Cannot create update params with % invalid keys: %', array_length(invalid_keys, 1), array_to_string(invalid_keys, ', ');
    end if;

    for key_val, col_name in select * from json_each(permitted_key_to_col_map)
        loop
            if set_vals::jsonb ? key_val then
                params_text := params_text || separator || col_name || ' = ' || format('%L', set_vals ->> key_val);
                separator := ', ';
            end if;
        end loop;

    if length(params_text) = 0 then
        raise exception 'Failed to create any update params for %', set_vals;
    end if;

    return params_text;
end
$function$
;

CREATE OR REPLACE FUNCTION public.update_entry(_entry_id uuid, _update_values json)
 RETURNS entries
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
    updated_entry  public.entries;
    update_query   text;
    key_to_col_map json :=
        json_build_object(
            'text_content', 'text_content',
            'success', 'success',
            'date_of', 'date_of'
        );
begin
    if exists(select 1
              from public.goals g
                       join public.entries e on g.id = e.goal and g.owner = auth.uid()) then
        update_query :=
            format(
                $$UPDATE public.entries SET %s WHERE id = '%s' RETURNING *$$,
                public.conditional_update_params(
                    _update_values,
                    key_to_col_map
                ),
                _entry_id
            );

        execute update_query into updated_entry;

        return updated_entry;
    else
        raise exception 'The entry with id % does not exist or you do not have access to modify it.', _entry_id;
    end if;
end;
$function$
;
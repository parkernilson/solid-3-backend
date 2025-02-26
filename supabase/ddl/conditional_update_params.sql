drop function conditional_update_params(json, json);

create or replace function conditional_update_params(set_vals json, permitted_key_to_col_map json) returns text as
$$
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
$$ language plpgsql;
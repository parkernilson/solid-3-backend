drop function create_entry;

create or replace function create_entry(
    _goal_id uuid, _success boolean, _date_of date,
    _text_content text default null
) returns public.entries
    security definer
    set search_path = ''
    language plpgsql
as
$$
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
$$;

drop function update_entry;

create or replace function update_entry(
    _entry_id uuid, _update_values json
) returns public.entries
    security definer
    set search_path = ''
    language plpgsql
as
$body$
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
$body$;
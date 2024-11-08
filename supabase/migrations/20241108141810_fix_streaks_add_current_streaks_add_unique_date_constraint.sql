CREATE UNIQUE INDEX unique_entry_date_per_goal ON public.entries USING btree (goal, date_of) WHERE (date_of IS NOT NULL);

set check_function_bodies = off;

create type "public"."current_streak_info" as ("current_period_success" boolean, "start_date" date, "end_date" date, "streak_count" numeric);

CREATE OR REPLACE FUNCTION public.get_current_streak_info(_goal_id uuid)
 RETURNS current_streak_info
 LANGUAGE plpgsql
AS $function$
declare
    most_recent_streak record;
begin
    select * into most_recent_streak from public.get_streaks(_goal_id) order by end_date desc limit 1;

    raise notice '%', row_to_json(most_recent_streak);

    if most_recent_streak is not null and current_date - most_recent_streak.end_date <= 1 and
       current_date - most_recent_streak.end_date > -1 then
        return ROW (
            current_date = most_recent_streak.end_date,
            most_recent_streak.start_date,
            most_recent_streak.end_date,
            most_recent_streak.streak_count
            )::current_streak_info;
    else
        return null;
    end if;

end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_streaks(_goal_id uuid)
 RETURNS TABLE(start_date date, end_date date, streak_count bigint, goal uuid, sequence_id numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
        WITH sequences AS (SELECT e.date_of,
                                  extract(julian from e.date_of) - ROW_NUMBER() OVER (ORDER BY e.date_of) sequence_id
                           FROM public.entries e
                           where e.success = true)
        SELECT MIN(sequences.date_of) as start_date,
               MAX(sequences.date_of) as end_date,
               COUNT(*)               as streak_count,
               _goal_id               as goal,
               sequences.sequence_id
        FROM sequences
        GROUP BY sequences.sequence_id;
END
$function$
;
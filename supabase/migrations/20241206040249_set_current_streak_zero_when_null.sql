set check_function_bodies = off;

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
        return ROW (
            null,
            null,
            null,
            0
            )::current_streak_info;
    end if;

end;
$function$
;




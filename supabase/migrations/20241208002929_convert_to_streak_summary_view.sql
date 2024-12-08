set check_function_bodies = off;

create or replace view "public"."streak_summary" as  WITH sequences AS (
         SELECT e.date_of,
            (EXTRACT(julian FROM e.date_of) - (row_number() OVER (ORDER BY e.date_of))::numeric) AS sequence_id,
            e.goal
           FROM entries e
          WHERE (e.success = true)
        )
 SELECT min(sequences.date_of) AS start_date,
    max(sequences.date_of) AS end_date,
    count(*) AS streak_count,
    sequences.goal,
    sequences.sequence_id
   FROM sequences
  GROUP BY sequences.sequence_id, sequences.goal;


CREATE OR REPLACE FUNCTION public.get_current_streak_info(_goal_id uuid)
 RETURNS current_streak_info
 LANGUAGE plpgsql
AS $function$
declare
    most_recent_streak record;
begin
    select *
    into most_recent_streak
    from public.streak_summary
    where goal = _goal_id
    order by end_date desc
    limit 1;

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

drop function get_streaks;


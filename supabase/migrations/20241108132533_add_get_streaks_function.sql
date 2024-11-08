set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_streaks(_goal_id uuid)
 RETURNS TABLE(start_date date, end_date date, streak_count bigint, goal uuid, sequence_id numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
        WITH sequences AS (SELECT e.date_of,
                                  extract(julian from e.date_of) - ROW_NUMBER() OVER (ORDER BY e.date_of) sequence_id
                           FROM public.entries e)
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




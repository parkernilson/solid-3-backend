create view streak_summary(start_date, end_date, streak_count, goal, sequence_id) as
WITH sequences AS (SELECT e.date_of,
                          EXTRACT(julian FROM e.date_of) -
                          row_number() OVER (PARTITION BY e.goal ORDER BY e.date_of)::numeric AS sequence_id,
                          e.goal
                   FROM entries e
                   WHERE e.success = true)
SELECT min(sequences.date_of) AS start_date,
       max(sequences.date_of) AS end_date,
       count(*)               AS streak_count,
       sequences.goal,
       sequences.sequence_id
FROM sequences
GROUP BY sequences.sequence_id, sequences.goal;
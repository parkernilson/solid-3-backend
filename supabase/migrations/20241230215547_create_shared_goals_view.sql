create or replace view "public"."shared_goals" as  SELECT g.id AS goal_id,
    sr.id AS share_record_id,
    g.title AS goal_title,
    g.owner AS goal_owner_id,
    p.email AS goal_owner_email,
    sr.status AS share_status,
    sr.shared_with,
    sr.created_at AS shared_on
   FROM ((goals g
     JOIN share_records sr ON ((g.id = sr.goal)))
     JOIN profiles p ON ((g.owner = p.id)));
create or replace view "public"."shared_goals" as  SELECT g.id AS goal_id,
    g.title,
    g.owner,
    g.created_at,
    p.email AS owner_email,
    p.profile_image_path AS owner_profile_image_path,
    sr.created_at AS shared_on,
    sr.shared_with,
    g.start_date
   FROM ((goals g
     JOIN profiles p ON ((g.owner = p.id)))
     JOIN share_records sr ON ((sr.goal = g.id)))
  WHERE (sr.status = 'accepted'::shared_goal_status);





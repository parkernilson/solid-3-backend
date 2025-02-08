drop view if exists "public"."shared_goal_previews";

drop view if exists "public"."shared_goals";

create or replace view "public"."shared_goal_previews" as  SELECT g.id AS goal_id,
    sr.id AS share_record_id,
    g.title AS goal_title,
    g.owner AS goal_owner_id,
    p.email AS goal_owner_email,
    p.profile_image_path AS goal_owner_profile_image_path,
    sr.status AS share_status,
    sr.shared_with,
    sr.created_at AS shared_on
   FROM ((goals g
     JOIN share_records sr ON ((g.id = sr.goal)))
     JOIN profiles p ON ((g.owner = p.id)));


create or replace view "public"."shared_goals" as  SELECT g.id AS goal_id,
    g.title,
    g.owner,
    g.created_at,
    p.email AS owner_email,
    p.profile_image_path AS owner_profile_image_path,
    sr.created_at AS shared_on,
    sr.shared_with
   FROM ((goals g
     JOIN profiles p ON ((g.owner = p.id)))
     JOIN share_records sr ON ((sr.goal = g.id)))
  WHERE (sr.status = 'accepted'::shared_goal_status);
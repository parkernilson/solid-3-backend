drop policy "Users that have been shared with can SELECT" on "public"."goals";

drop policy "Owner can SELECT" on "public"."shared_goals";

alter table "public"."entries" add column "date_of" date not null default now();

create policy "Users that have been shared with can SELECT"
on "public"."goals"
as permissive
for select
to anon
using ((( SELECT auth.uid() AS uid) IN ( SELECT sg.shared_with
   FROM shared_goals sg
  WHERE ((sg.goal = goals.id) AND ((sg.status = 'accepted'::shared_goal_status) OR (sg.status = 'pending'::shared_goal_status))))));


create policy "Owner can SELECT"
on "public"."shared_goals"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = ( SELECT g.owner
   FROM goals g
  WHERE (g.id = shared_goals.goal))));
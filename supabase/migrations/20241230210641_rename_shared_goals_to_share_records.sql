drop policy "Owner can SELECT" on "public"."shared_goals";

drop policy "Shared with can SELECT" on "public"."shared_goals";

drop policy "Users who have accepted share request can SELECT" on "public"."entries";

drop policy "Users that have been shared with can SELECT" on "public"."goals";

revoke delete on table "public"."shared_goals" from "anon";

revoke insert on table "public"."shared_goals" from "anon";

revoke references on table "public"."shared_goals" from "anon";

revoke select on table "public"."shared_goals" from "anon";

revoke trigger on table "public"."shared_goals" from "anon";

revoke truncate on table "public"."shared_goals" from "anon";

revoke update on table "public"."shared_goals" from "anon";

revoke delete on table "public"."shared_goals" from "authenticated";

revoke insert on table "public"."shared_goals" from "authenticated";

revoke references on table "public"."shared_goals" from "authenticated";

revoke select on table "public"."shared_goals" from "authenticated";

revoke trigger on table "public"."shared_goals" from "authenticated";

revoke truncate on table "public"."shared_goals" from "authenticated";

revoke update on table "public"."shared_goals" from "authenticated";

revoke delete on table "public"."shared_goals" from "service_role";

revoke insert on table "public"."shared_goals" from "service_role";

revoke references on table "public"."shared_goals" from "service_role";

revoke select on table "public"."shared_goals" from "service_role";

revoke trigger on table "public"."shared_goals" from "service_role";

revoke truncate on table "public"."shared_goals" from "service_role";

revoke update on table "public"."shared_goals" from "service_role";

alter table "public"."shared_goals" drop constraint "shared_goals_goal_fkey";

alter table "public"."shared_goals" drop constraint "shared_goals_shared_with_fkey";

alter table "public"."shared_goals" drop constraint "shared_goals_pkey";

drop index if exists "public"."shared_goals_pkey";

drop table "public"."shared_goals";

create table "public"."share_records" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "goal" uuid not null,
    "shared_with" uuid not null,
    "status" shared_goal_status not null default 'pending'::shared_goal_status
);


alter table "public"."share_records" enable row level security;

CREATE UNIQUE INDEX shared_goals_pkey ON public.share_records USING btree (id);

alter table "public"."share_records" add constraint "shared_goals_pkey" PRIMARY KEY using index "shared_goals_pkey";

alter table "public"."share_records" add constraint "shared_goals_goal_fkey" FOREIGN KEY (goal) REFERENCES goals(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."share_records" validate constraint "shared_goals_goal_fkey";

alter table "public"."share_records" add constraint "shared_goals_shared_with_fkey" FOREIGN KEY (shared_with) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."share_records" validate constraint "shared_goals_shared_with_fkey";

grant delete on table "public"."share_records" to "anon";

grant insert on table "public"."share_records" to "anon";

grant references on table "public"."share_records" to "anon";

grant select on table "public"."share_records" to "anon";

grant trigger on table "public"."share_records" to "anon";

grant truncate on table "public"."share_records" to "anon";

grant update on table "public"."share_records" to "anon";

grant delete on table "public"."share_records" to "authenticated";

grant insert on table "public"."share_records" to "authenticated";

grant references on table "public"."share_records" to "authenticated";

grant select on table "public"."share_records" to "authenticated";

grant trigger on table "public"."share_records" to "authenticated";

grant truncate on table "public"."share_records" to "authenticated";

grant update on table "public"."share_records" to "authenticated";

grant delete on table "public"."share_records" to "service_role";

grant insert on table "public"."share_records" to "service_role";

grant references on table "public"."share_records" to "service_role";

grant select on table "public"."share_records" to "service_role";

grant trigger on table "public"."share_records" to "service_role";

grant truncate on table "public"."share_records" to "service_role";

grant update on table "public"."share_records" to "service_role";

create policy "Owner can SELECT"
on "public"."share_records"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = ( SELECT g.owner
   FROM goals g
  WHERE (g.id = share_records.goal))));


create policy "Shared with can SELECT"
on "public"."share_records"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = shared_with));


create policy "Users who have accepted share request can SELECT"
on "public"."entries"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM share_records sg
  WHERE ((sg.goal = entries.goal) AND (sg.shared_with = auth.uid()) AND (sg.status = 'accepted'::shared_goal_status)))));


create policy "Users that have been shared with can SELECT"
on "public"."goals"
as permissive
for select
to anon
using ((( SELECT auth.uid() AS uid) IN ( SELECT sg.shared_with
   FROM share_records sg
  WHERE ((sg.goal = goals.id) AND ((sg.status = 'accepted'::shared_goal_status) OR (sg.status = 'pending'::shared_goal_status))))));

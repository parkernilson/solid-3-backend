set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.unshare_goal(_goal_id uuid, _with_user uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
    if exists(select 1
              from public.goals g
                       join public.shared_goals sg
                            on g.id = sg.goal
                                and g.id = _goal_id
                                and sg.shared_with = _with_user) then
        delete from public.shared_goals sg where sg.goal = _goal_id and sg.goal = _goal_id;
    else
        raise exception 'There is no goal with id % shared with user with id %, or you do not have access to modify it', _goal_id, _with_user;
    end if;
end;
$function$
;




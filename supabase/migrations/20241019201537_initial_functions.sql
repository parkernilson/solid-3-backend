set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.accept_shared_goal(_goal_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    _shared_goal public.shared_goals;
BEGIN
    -- Fetch the shared goal for the current user and the specified goal
    SELECT * INTO _shared_goal
    FROM public.shared_goals sg
    WHERE sg.goal = _goal_id AND sg.shared_with = auth.uid();

    -- Check if the shared goal exists for the current user
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Shared goal for goal ID % not found or you do not have permission to accept it', _goal_id;
    END IF;

    -- Check if the shared goal is already accepted or rejected
    IF _shared_goal.status != 'pending' THEN
        RAISE EXCEPTION 'This shared goal has already been % and cannot be accepted', _shared_goal.status;
    END IF;

    -- Update the shared goal status to 'accepted'
    UPDATE public.shared_goals
    SET status = 'accepted'
    WHERE id = _shared_goal.id;

END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_entry(_goal_id uuid, _success boolean, _text_content text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    _goal public.goals;
BEGIN
    -- Fetch the goal and check ownership
    SELECT * INTO _goal
    FROM public.goals g
    WHERE g.id = _goal_id AND g.owner = current_user;

    -- Check if the goal exists and belongs to the current user
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Goal with ID % not found or you do not have permission to access it', _goal_id;
    END IF;

    -- Insert the new entry
    INSERT INTO public.entries (goal, success, text_content)
    VALUES (_goal_id, _success, _text_content);

END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_goal(_title text)
 RETURNS goals
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
    insert into public.goals (title, owner)
    values (_title, auth.uid());
end;
$function$
;

CREATE OR REPLACE FUNCTION public.share_goal(_goal_id uuid, _with_user uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    _goal public.goals;
BEGIN
    -- Fetch the goal and check ownership
    SELECT * INTO _goal
    FROM public.goals g
    WHERE g.id = _goal_id AND g.owner = auth.uid();

    -- Check if the goal exists and belongs to the current user
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Goal with ID % not found or you do not have permission to share it', _goal_id;
    END IF;

    -- Check if the user is trying to share with themselves
    IF auth.uid() = _with_user THEN
        RAISE EXCEPTION 'You cannot share a goal with yourself';
    END IF;

    -- Check if the goal is already shared with the user
    IF EXISTS (
        SELECT 1
        FROM public.shared_goals sg
        WHERE sg.goal = _goal_id AND sg.shared_with = _with_user
    ) THEN
        RAISE EXCEPTION 'This goal is already shared with the specified user';
    END IF;

    -- Insert the new shared_goal entry
    INSERT INTO public.shared_goals (goal, shared_with, status)
    VALUES (_goal_id, _with_user, 'pending');

END;
$function$
;




set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.accept_shared_goal(_goal_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    _share_record public.share_records;
BEGIN
    -- Fetch the shared goal for the current user and the specified goal
    SELECT * INTO _share_record
    FROM public.share_records sr
    WHERE sr.goal = _goal_id AND sr.shared_with = auth.uid();

    -- Check if the shared goal exists for the current user
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Share record for goal ID % not found or you do not have permission to accept it', _goal_id;
    END IF;

    -- Check if the shared goal is already accepted or rejected
    IF _share_record.status != 'pending' THEN
        RAISE EXCEPTION 'This shared goal has already been % and cannot be accepted', _share_record.status;
    END IF;

    -- Update the shared goal status to 'accepted'
    UPDATE public.share_records
    SET status = 'accepted'
    WHERE id = _share_record.id;

END;
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
        FROM public.share_records sr
        WHERE sr.goal = _goal_id AND sr.shared_with = _with_user
    ) THEN
        RAISE EXCEPTION 'This goal is already shared with the specified user';
    END IF;

--     Insert the new share record
    INSERT INTO public.share_records (goal, shared_with, status)
    VALUES (_goal_id, _with_user, 'pending');

END;
$function$
;




set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_profile(_user_id uuid, _email text DEFAULT NULL::text, _profile_image_url text DEFAULT NULL::text)
 RETURNS profiles
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
    _existing_profile public.profiles;
    _updated_profile public.profiles;
begin
    select * from public.profiles into _existing_profile;
    if NOT FOUND then
        raise exception 'Cannot update nonexistent profile';
    end if;

    update public.profiles
        set profile_image_url = COALESCE(_profile_image_url, profile_image_url),
            email = COALESCE(_email, email)
        where id = _user_id
        returning * into _updated_profile;

    return _updated_profile;
end;
$function$
;




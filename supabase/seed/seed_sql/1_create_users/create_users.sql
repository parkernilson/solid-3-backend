do $$
declare test_user_password text;
begin
    select e.value into test_user_password from secrets.env e where e.key = 'test_user_password';

    perform public.create_user('danexample@gmail.com', test_user_password);
    perform public.create_user('sabrinatest@gmail.com', test_user_password);
    perform public.create_user('greg@gmail.com', test_user_password);
end;
$$ language plpgsql;

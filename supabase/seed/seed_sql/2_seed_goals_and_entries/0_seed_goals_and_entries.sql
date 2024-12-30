do $$
declare
    user_1_id uuid;
    user_2_id uuid;
    goal_1_id uuid;
    goal_2_id uuid;
    cur_date date;
    should_create_entry boolean;
    is_successful boolean;
    success_messages text[] := array[
        'Great workout today!',
        'Completed my exercise goal!',
        'Feeling strong after exercise',
        'Another successful workout day'
    ];
    failure_messages text[] := array[
        'Missed workout today',
        'Not feeling well, skipped exercise',
        'Too busy today for workout',
        'Will try again tomorrow'
    ];
begin
    select u.id into user_1_id from auth.users u where u.email = 'danexample@gmail.com';
    select u.id into user_2_id from auth.users u where u.email = 'sabrinatest@gmail.com';

    insert into public.goals (title, owner)
    values ('Exercise every day', user_1_id)
    returning id into goal_1_id;

    insert into public.goals (title, owner)
    values ('Exercise every day', user_2_id)
    returning id into goal_2_id;

    -- Start from a year ago and loop forward
    cur_date := now() - interval '1 year';

    -- Loop for 365 days
    for i in 1..365 loop
        should_create_entry := random() < 0.8;

        if should_create_entry then
            is_successful := random() < 0.75;

            insert into public.entries (goal, text_content, success, date_of)
            values (
                goal_1_id,
                case
                    when is_successful then
                        success_messages[1 + floor(random() * array_length(success_messages, 1))::int]
                    else
                        failure_messages[1 + floor(random() * array_length(failure_messages, 1))::int]
                end,
                is_successful,
                cur_date
            ), (
                goal_2_id,
                case
                    when is_successful then
                        success_messages[1 + floor(random() * array_length(success_messages, 1))::int]
                    else
                        failure_messages[1 + floor(random() * array_length(failure_messages, 1))::int]
                end,
                is_successful,
                cur_date
            );
        end if;

        -- Increment the date by 1 day
        cur_date := cur_date + interval '1 day';
    end loop;

--     Share goals
    insert into public.share_records (goal, shared_with, status)
    values (goal_2_id, user_1_id, 'pending');
end;
$$ language plpgsql;
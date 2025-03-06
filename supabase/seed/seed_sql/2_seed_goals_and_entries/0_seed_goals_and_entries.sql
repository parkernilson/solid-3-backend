do $$
declare
    user_1_id uuid;
    user_2_id uuid;
    goal_1_id uuid;
    goal_2_id uuid;
    cur_date date;
    should_create_entry boolean;
    is_successful boolean;
    text_content_null boolean;
    success_messages text[] := array[
        -- 2 chars (emoji)
        '👍',
        -- 20 chars
        'Great workout today!',
        -- 27 chars
        'Completed my exercise goal!',
        -- 76 chars
        'This weekend I am planning on doing something that takes a little more time.',
        -- 200 chars
        'Crushed legs today. 5x5 squats @ 245lbs, lunges 3x12 each side. Hamstring curls felt stronger. Calves still weak point. Cardio: 15 min HIIT. Energy good despite lack of sleep. Push harder tomorrow.'
    ];
    failure_messages text[] := array[
        -- 2 chars (emoji)
        '😴',
        -- 21 chars
        'Missed workout today.',
        -- 27 chars
        'No exercise, feeling tired.',
        -- 78 chars
        'Couldn''t make it to the gym today due to unexpected work. Will reschedule soon.',
        -- 279 chars
        'Skipped training today. Woke up with sore throat and slight fever. Tried to push through but body needs rest. Taking meds and hydrating extra. Will do light stretching instead of planned heavy session. Hope to recover by Friday for weekend long run. Need to improve sleep habits.'
    ];
begin
    select u.id into user_1_id from auth.users u where u.email = 'danexample@gmail.com';
    select u.id into user_2_id from auth.users u where u.email = 'sabrinatest@gmail.com';

    -- Start from a year ago and loop forward
    cur_date := now() - interval '1 year';

    insert into public.goals (title, owner, start_date)
    values ('Exercise every day', user_1_id, cur_date)
    returning id into goal_1_id;

    insert into public.goals (title, owner, start_date)
    values ('Exercise every day', user_2_id, cur_date)
    returning id into goal_2_id;

    -- Loop for 365 days
    for i in 1..365 loop
        should_create_entry := random() < 0.8;

        if should_create_entry then
            text_content_null := random() < 0.2;
            is_successful := random() < 0.75;

            insert into public.entries (goal, text_content, success, date_of)
            values (
                goal_1_id,
                case
                    when text_content_null then
                        null
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
                    when text_content_null then
                        null
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
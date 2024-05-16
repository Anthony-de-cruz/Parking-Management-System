-- !psql

INSERT INTO app_user (username, password, email, phone_number, is_admin, is_banned, balance)
VALUES ('admin1', 'password', 'example@email.com', '+447532742960', TRUE, FALSE, 7000);

INSERT INTO app_user (username, password, email, phone_number, is_admin, is_banned)
VALUES ('user1', 'password', 'example@email.com', '+447532742960', FALSE, FALSE);

UPDATE app_user
SET balance = balance + 6000
WHERE username = 'user1';

INSERT INTO app_user (username, password, email, phone_number, is_admin, is_banned)
VALUES ('bannedUser1', 'password', 'example@email.com','+447532742960', FALSE, TRUE);

UPDATE app_user
SET balance = balance + 600
WHERE username = 'bannedUser1';

INSERT INTO carpark (name, hourly_fare)
VALUES ('Main Carpark', 200);

DO
$$
    DECLARE
        target_carpark_id INTEGER;
        initial_latitude  FLOAT := 52.62312425549774;
        initial_longitude FLOAT := 1.2426033813474213;
        lat               INTEGER;
        long              INTEGER;
        delta_meters      FLOAT := 2.5;
        latitude_delta    FLOAT :=
            delta_meters / 111320; -- Convert meters to degrees (latitude)
        longitude_delta   FLOAT :=
            delta_meters / (111320 * cos(radians(10))); -- Assuming latitude 10 degrees for simplicity
    BEGIN
        SELECT carpark_id
        INTO target_carpark_id
        FROM carpark
        WHERE name = 'Main Carpark';

        FOR lat IN 1..5
            LOOP
                FOR long IN 1..5
                    LOOP
                        INSERT INTO parking_space (carpark_id, latitude, longitude)
                        VALUES (target_carpark_id, initial_latitude + (lat * latitude_delta),
                                initial_longitude + (long * longitude_delta));
                    END LOOP;
            END LOOP;
    END
$$;

INSERT INTO carpark (name, hourly_fare)
VALUES ('Side Carpark', 300);

-- Populate the side carpark
DO
$$
    DECLARE
        target_carpark_id INTEGER;
        initial_latitude  FLOAT := 52.62209697654385;
        initial_longitude FLOAT := 1.234998538040973;
        lat               INTEGER;
        long              INTEGER;
        delta_meters      FLOAT := 2.5;
        -- Convert meters to degrees (latitude)
        latitude_delta    FLOAT :=
            delta_meters / 111320;
        -- Assuming latitude 10 degrees for simplicity
        longitude_delta   FLOAT :=
            delta_meters / (111320 * cos(radians(10)));
    BEGIN
        SELECT carpark_id
        INTO target_carpark_id
        FROM carpark
        WHERE name = 'Side Carpark';

        FOR lat IN 1..3
            LOOP
                FOR long IN 1..3
                    LOOP
                        INSERT INTO parking_space (carpark_id, latitude, longitude)
                        VALUES (target_carpark_id, initial_latitude + (lat * latitude_delta),
                                initial_longitude + (long * longitude_delta));
                    END LOOP;
            END LOOP;
    END
$$;

INSERT INTO booking (parking_space_id, booking_username, start, finish)
VALUES (2, 'user1', '2044-01-01 00:10', '2044-01-01 00:20');

UPDATE booking
SET finish = '2044-01-01 02:20'
WHERE booking_id = 1;

DELETE
FROM booking
WHERE booking_id = 1;

INSERT INTO booking (parking_space_id, booking_username, start, finish)
VALUES (5, 'admin1', '2046-01-01 00:10', '2046-01-01 06:20');

INSERT INTO booking (parking_space_id, booking_username, start, finish)
VALUES (2, 'admin1', '2045-01-01 00:10', '2045-01-01 06:20');

INSERT INTO booking (parking_space_id, booking_username, start, finish)
VALUES (3, 'bannedUser1', '2045-01-01 00:10', '2045-01-01 00:20');

INSERT INTO booking (parking_space_id, booking_username, start, finish)
VALUES (3, 'admin1', '2045-01-01 02:10', '2045-01-01 02:20');

INSERT INTO booking (parking_space_id, booking_username, start, finish)
VALUES (get_nearest_available_parking_space(
                1.242677832156197,
                52.62196137224319,
                '2055-01-01 02:10',
                '2055-01-01 02:20'),
        'user1',
        '2055-01-01 02:10',
        '2055-01-01 02:20');



SELECT distance
FROM get_parking_spaces_by_distance(1.0, 1.0) AS sorted
         JOIN booking
              ON booking.parking_space_id = sorted.parking_space_id
WHERE sorted.parking_space_id = 5
  AND booking.approved = true;
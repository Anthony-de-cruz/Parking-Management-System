-- !psql

INSERT INTO app_user (username, password, email, is_admin, is_banned, balance)
VALUES ('BigDave5', 'big', 'wheey@email.com', TRUE, FALSE, 7000);

INSERT INTO app_user (username, password, email, is_admin, is_banned)
VALUES ('bob', 'password', 'bob@bob.bob', FALSE, FALSE);

UPDATE app_user
SET balance = balance + 6000
WHERE username = 'bob';

INSERT INTO app_user (username, password, email, is_admin, is_banned)
VALUES ('EvilBob', 'password', 'not@bob.bob', FALSE, TRUE);

UPDATE app_user
SET balance = balance + 600
WHERE username = 'EvilBob';

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
VALUES (2, 'bob', '2044-01-01 00:10', '2044-01-01 00:20');

UPDATE booking
SET finish = '2044-01-01 02:20'
WHERE booking_id = 1;

DELETE
FROM booking
WHERE booking_id = 1;

INSERT INTO booking (parking_space_id, booking_username, start, finish)
VALUES (5, 'BigDave5', '2046-01-01 00:10', '2046-01-01 06:20');

INSERT INTO booking (parking_space_id, booking_username, start, finish)
VALUES (2, 'BigDave5', '2045-01-01 00:10', '2045-01-01 06:20');

INSERT INTO booking (parking_space_id, booking_username, start, finish)
VALUES (3, 'EvilBob', '2045-01-01 00:10', '2045-01-01 00:20');

INSERT INTO booking (parking_space_id, booking_username, start, finish)
VALUES (3, 'BigDave5', '2045-01-01 02:10', '2045-01-01 02:20');

INSERT INTO booking (parking_space_id, booking_username, start, finish)
VALUES (get_nearest_available_parking_space(
                1.242677832156197,
                52.62196137224319,
                '2055-01-01 02:10',
                '2055-01-01 02:20'),
        'bob',
        '2055-01-01 02:10',
        '2055-01-01 02:20');

-- SELECT get_nearest_available_parking_space(
--                1.2405095686419425,
--                52.62118833234374,
--                '2056-01-01 02:10',
--                '2056-01-01 02:20')
--            AS id;
--
-- SELECT calculate_booking_deposit(
--                '2056-01-01 02:10',
--                '2056-01-01 02:20',
--                1)
--            AS deposit;


SELECT latitude,
       longitude,
       carpark.name AS carpark_name,
       booking.parking_space_id
FROM booking
         JOIN parking_space
              ON booking.booking_id = 2 AND
                 booking.booking_username = 'BigDave5' AND
                 parking_space.parking_space_id = booking.parking_space_id
         JOIN carpark
              ON carpark.carpark_id = parking_space.carpark_id;

SELECT COUNT(1) AS exists
FROM booking
WHERE booking_username = 'BigDave5'
  AND booking_id = 2;


SELECT start,
       finish,
       status,
       occupant_username,
       latitude,
       longitude,
       carpark_id,
       booking.parking_space_id
FROM booking
         JOIN parking_space
              ON booking.booking_id = 2 AND
                 booking.booking_username = 'BigDave5' AND
                 parking_space.parking_space_id = booking.parking_space_id;

SELECT distance
FROM get_parking_spaces_by_distance(1.2427174024815264, 52.623146713277116)
WHERE parking_space_id = 5;


UPDATE parking_space
SET occupant_username = 'bob'
WHERE parking_space_id = 16;
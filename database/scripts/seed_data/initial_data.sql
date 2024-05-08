-- !psql

INSERT INTO app_user (username, password, email, is_admin, is_banned, balance)
VALUES ('BigDave5', 'big', 'wheey@email.com', TRUE, FALSE, 7000);

INSERT INTO app_user (username, password, email, is_admin, is_banned)
VALUES ('bob', 'password', 'bob@bob.bob', FALSE, FALSE);

UPDATE app_user
SET balance = balance + 6000
WHERE username = 'bob';

INSERT INTO app_user (username, password, email, is_admin, is_banned)
VALUES ('job', 'password2', 'job@bob.bob', FALSE, FALSE);

UPDATE app_user
SET balance = balance + 600
WHERE username = 'job';

INSERT INTO carpark (name, hourly_fare)
VALUES ('main parking lot', 200);

INSERT INTO parking_space (carpark_id, latitude, longitude)
VALUES (1, 30, 20);

INSERT INTO parking_space (carpark_id, latitude, longitude)
VALUES (1, 30, 25);

INSERT INTO parking_space (carpark_id, latitude, longitude)
VALUES (1, 30, 21.0);

INSERT INTO carpark (name, hourly_fare)
VALUES ('side parking lot', 300);

INSERT INTO parking_space (carpark_id, latitude, longitude)
VALUES (2, 30.0, 22.0);

INSERT INTO parking_space (carpark_id, latitude, longitude)
VALUES (2, 20.0, 22.0);

INSERT INTO parking_space (carpark_id, latitude, longitude)
VALUES (2, 20.0, 21.0);

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
VALUES (3, 'job', '2045-01-01 00:10', '2045-01-01 00:20');

INSERT INTO booking (parking_space_id, booking_username, start, finish)
VALUES (3, 'BigDave5', '2045-01-01 02:10', '2045-01-01 02:20');


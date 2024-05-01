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

INSERT INTO carpark (name, hourly_fare, gps)
VALUES ('main parking lot', 200, '(50, 20)');

INSERT INTO parking_space (carpark_id, gps)
VALUES (1, '(50, 20)');

INSERT INTO parking_space (carpark_id, gps)
VALUES (1, '(50, 30)');

INSERT INTO parking_space (carpark_id, gps)
VALUES (1, '(60, 60)');

INSERT INTO carpark (name, hourly_fare, gps)
VALUES ('side parking lot', 300, '(100, 20)');

INSERT INTO parking_space (carpark_id, gps)
VALUES (2, '(10, 20)');

INSERT INTO parking_space (carpark_id, gps)
VALUES (2, '(50, 69)');

INSERT INTO parking_space (carpark_id, gps)
VALUES (2, '(1, 20)');

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

-- !PLpgSQL

INSERT INTO app_user (username, password, email, is_admin, is_banned)
VALUES ('bob', 'password', 'bob@bob.bob', FALSE, FALSE);

UPDATE app_user
SET balance = balance + 500
WHERE username = 'bob';

INSERT INTO app_user (username, password, email, is_admin, is_banned)
VALUES ('job', 'password2', 'job@bob.bob', FALSE, FALSE);

INSERT INTO app_user (username, password, email, is_admin, is_banned)
VALUES ('BigDave5', 'big', 'wheey@email.com', TRUE, FALSE);

INSERT INTO vehicle (registration, owner_username)
VALUES ('EEG', 'bob');

INSERT INTO vehicle (registration, owner_username)
VALUES ('AS3 ISD', 'bob');

INSERT INTO vehicle (registration, owner_username)
VALUES ('123', 'job');

INSERT INTO vehicle (registration, owner_username)
VALUES ('BT 2822', 'BigDave5');

INSERT INTO carpark (name, booking_cost, gps)
VALUES ('main parking lot', 500, '(50, 20)');

INSERT INTO parking_space (carpark_id, gps)
VALUES (1, '(50, 20)');

INSERT INTO carpark (name, booking_cost, gps)
VALUES ('side parking lot', 400, '(100, 20)');

-- INSERT INTO booking (parking_space_id, registration, start, finish)
-- VALUES (1, 'EEG', '01-01-2044 00:00', '01-01-2044 00:10');
--
-- INSERT INTO booking (parking_space_id, registration, start, finish)
-- VALUES (1, '123', '01-01-2044 00:10', '01-01-2044 00:20');

CALL create_booking(1, 'EEG', '01-01-2044 00:00', '01-01-2044 00:10');
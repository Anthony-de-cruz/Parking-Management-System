-- !PLpgSQL

INSERT INTO app_user (username, password, email, is_admin)
VALUES ('bob', 'password', 'bob@bob.bob', FALSE);

INSERT INTO app_user (username, password, email, is_admin)
VALUES ('job', 'password2', 'job@bob.bob', FALSE);

INSERT INTO app_user (username, password, email, is_admin)
VALUES ('BigDave5', 'big', 'wheey@email.com', TRUE);

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


UPDATE app_user
SET balance = balance + 500
WHERE username = 'bob';

SELECT password
FROM app_user
WHERE username = 'bob';
SELECT password
FROM app_user
WHERE username = 'BigDave5';

CALL create_booking(1, 'EEG', '01-01-2044 00:00', '01-01-2044 00:10');
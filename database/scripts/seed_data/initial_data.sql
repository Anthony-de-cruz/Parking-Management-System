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

INSERT INTO carpark (name)
VALUES ('main parking lot');

SELECT password
FROM app_user
WHERE username = 'bob';
SELECT password
FROM app_user
WHERE username = 'BigDave5';

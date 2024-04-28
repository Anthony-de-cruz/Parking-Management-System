-- !PLpgSQL

INSERT INTO "User" (username, password, email, isAdmin)
VALUES ('bob', 'password', 'bob@bob.bob', FALSE);

INSERT INTO "User" (username, password, email, isAdmin)
VALUES ('job', 'password2', 'job@bob.bob', FALSE);

INSERT INTO "User" (username, password, email, isadmin)
VALUES ('BigDave5', 'big', 'wheey@email.com', TRUE);

INSERT INTO "Vehicle" (registration, owner)
VALUES ('EEG', 'bob');

INSERT INTO "Vehicle" (registration, owner)
VALUES ('AS3 ISD', 'bob');

INSERT INTO "Carpark" (name)
VALUES ('main parking lot');

SELECT password
FROM "User"
WHERE username = 'bob';
SELECT password
FROM "User"
WHERE username = 'BigDave5';

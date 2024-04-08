-- !PLpgSQL

INSERT INTO "User" (username, password, email)
VALUES ('bob', 'password', 'bob@bob.bob');

INSERT INTO "User" (username, password, email)
VALUES ('job', 'password2', 'job@bob.bob');

INSERT INTO "Vehicle" (registration, userID)
VALUES ('eeg', 1);

INSERT INTO "Vehicle" (registration, userID)
VALUES ('doggo', 2);

INSERT INTO "Carpark" (name)
VALUES ('main parking lot');

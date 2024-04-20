-- !psql

CREATE TABLE IF NOT EXISTS "User"
(
    userID   SERIAL,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(20) NOT NULL,
    email    VARCHAR(30) NOT NULL,
    PRIMARY KEY (userID)
);

CREATE TABLE IF NOT EXISTS "Vehicle"
(
    registration VARCHAR(7),
    userID       SERIAL NOT NULL,
    PRIMARY KEY (registration),
    FOREIGN KEY (userID) REFERENCES "User" (userID)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Carpark"
(
    carparkID SERIAL,
    name      VARCHAR(20) NOT NULL UNIQUE,
    PRIMARY KEY (carparkID)
);

CREATE TABLE IF NOT EXISTS "ParkingSpace"
(
    parkingSpaceID SERIAL,
    carparkID      SERIAL NOT NULL,
    gps            POINT  NOT NULL,
    occupied       BOOLEAN DEFAULT false,
    registration   VARCHAR(7),
    PRIMARY KEY (parkingSpaceID),
    FOREIGN KEY (carparkID) REFERENCES "Carpark" (carparkID)
        ON DELETE RESTRICT,
    FOREIGN KEY (registration) REFERENCES "Vehicle" (registration)
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS "Booking"
(
    bookingID      SERIAL,
    parkingSpaceID SERIAL         NOT NULL,
    registration   CHAR(7)        NOT NULL,
    start          TIMESTAMP      NOT NULL,
    finish         TIMESTAMP      NOT NULL,
    charge         DECIMAL(19, 4) NOT NULL,
    PRIMARY KEY (bookingID),
    FOREIGN KEY (parkingSpaceID) REFERENCES "ParkingSpace" (parkingSpaceID)
        ON DELETE RESTRICT,
    FOREIGN KEY (registration) REFERENCES "Vehicle" (registration)
        ON DELETE RESTRICT
);
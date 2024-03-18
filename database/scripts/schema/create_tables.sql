-- !PLpgSQL

-- REBUILD Script
-- NUCLEAR BOMB
DROP TABLE IF EXISTS "Booking";
DROP TABLE IF EXISTS "ParkingSpace";
DROP TABLE IF EXISTS "Carpark";
DROP TABLE IF EXISTS "Vehicle";
DROP TABLE IF EXISTS "User";

CREATE Table "User"
(
    userID   INTEGER,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(20) NOT NULL,
    email    VARCHAR(30) NOT NULL,
    PRIMARY KEY (userID)
);

CREATE Table "Vehicle"
(
    registration VARCHAR(7),
    userID       INTEGER NOT NULL,
    PRIMARY KEY (registration),
    FOREIGN KEY (userID) REFERENCES "User" (userID)
        ON DELETE CASCADE
);

CREATE Table "Carpark"
(
    carparkID INTEGER,
    name      VARCHAR(20) NOT NULL UNIQUE,
    PRIMARY KEY (carparkID)
);

CREATE Table "ParkingSpace"
(
    parkingSpaceID INTEGER,
    carparkID      INTEGER NOT NULL,
    gps            POINT   NOT NULL,
    occupied       BOOLEAN DEFAULT false,
    registration   VARCHAR(7),
    PRIMARY KEY (parkingSpaceID),
    FOREIGN KEY (carparkID) REFERENCES "Carpark" (carparkID)
        ON DELETE RESTRICT,
    FOREIGN KEY (registration) REFERENCES "Vehicle" (registration)
        ON DELETE RESTRICT
);

CREATE Table "Booking"
(
    bookingID      INTEGER,
    parkingSpaceID INTEGER        NOT NULL,
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
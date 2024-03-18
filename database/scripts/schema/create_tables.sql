-- !PLpgSQL

-- REBUILD Script
-- NUCLEAR BOMB
DROP TABLE IF EXISTS "ParkingSpace";
DROP TABLE IF EXISTS "Carpark";
DROP TABLE IF EXISTS "Vehicle";
DROP TABLE IF EXISTS "User";

CREATE Table "User" (
    id INTEGER,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(20) NOT NULL,
    email VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE Table "Vehicle" (
    registration VARCHAR(7),
    id INTEGER NOT NULL,
    PRIMARY KEY (registration),
    FOREIGN KEY (id) REFERENCES "User" (id)
);

CREATE Table "Carpark" (
    carparkID INTEGER,
    name VARCHAR(20) NOT NULL,
    PRIMARY KEY (carparkID)
);

CREATE Table "ParkingSpace" (
    parkingSpaceID INTEGER,
    carparkID INTEGER NOT NULL,
    gps POINT NOT NULL,
    occupied  BOOLEAN DEFAULT false,
    registration VARCHAR(7),
    PRIMARY KEY (parkingSpaceID),
    FOREIGN KEY (carparkID) REFERENCES "Carpark" (carparkID),
    FOREIGN KEY (registration) REFERENCES "Vehicle" (registration)
);
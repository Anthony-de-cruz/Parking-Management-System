-- !psql

CREATE TABLE IF NOT EXISTS app_user
(
    username VARCHAR(20) NOT NULL,
    password VARCHAR(20) NOT NULL,
    email    VARCHAR(30) NOT NULL,
    is_admin BOOL        NOT NULL,
    balance  INTEGER DEFAULT 0,
    PRIMARY KEY (username)
);

CREATE TABLE IF NOT EXISTS vehicle
(
    registration   VARCHAR(7),
    owner_username VARCHAR(20) NOT NULL,
    PRIMARY KEY (registration),
    FOREIGN KEY (owner_username) REFERENCES app_user (username)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS carpark
(
    carpark_id   SERIAL,
    name         VARCHAR(20) NOT NULL UNIQUE,
    booking_cost DECIMAL(19, 4)     NOT NULL,
    gps                   POINT  NOT NULL,
    PRIMARY KEY (carpark_id)
);

CREATE TABLE IF NOT EXISTS parking_space
(
    parking_space_id      SERIAL,
    carpark_id            SERIAL NOT NULL,
    gps                   POINT  NOT NULL,
    occupied              BOOLEAN DEFAULT false,
    occupant_registration VARCHAR(7),
    PRIMARY KEY (parking_space_id),
    FOREIGN KEY (carpark_id) REFERENCES carpark (carpark_id)
        ON DELETE RESTRICT,
    FOREIGN KEY (occupant_registration) REFERENCES vehicle (registration)
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS transaction
(
    transaction_id SERIAL,
    username       VARCHAR(20)    NOT NULL,
    amount         DECIMAL(19, 4) NOT NULL,
    timestamp      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (transaction_id),
    FOREIGN KEY (username) REFERENCES app_user (username)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS booking
(
    booking_id       SERIAL,
    parking_space_id SERIAL    NOT NULL,
    registration     CHAR(7)   NOT NULL,
    start            TIMESTAMP NOT NULL,
    finish           TIMESTAMP NOT NULL,
    transaction_id   INTEGER   NOT NULL,
    PRIMARY KEY (booking_id),
    FOREIGN KEY (parking_space_id) REFERENCES parking_space (parking_space_id)
        ON DELETE RESTRICT,
    FOREIGN KEY (registration) REFERENCES vehicle (registration)
        ON DELETE RESTRICT,
    FOREIGN KEY (transaction_id) REFERENCES transaction (transaction_id)
        ON DELETE RESTRICT
);

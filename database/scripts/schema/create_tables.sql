-- !psql

CREATE TABLE IF NOT EXISTS app_user
(
    username  VARCHAR(20)           NOT NULL,
    password  VARCHAR(20)           NOT NULL,
    email     VARCHAR(30)           NOT NULL,
    is_admin  BOOLEAN               NOT NULL,
    is_banned BOOLEAN DEFAULT FALSE NOT NULL,
    balance   INTEGER DEFAULT 0,
    PRIMARY KEY (username)
);

CREATE TABLE IF NOT EXISTS carpark
(
    carpark_id  SERIAL,
    name        VARCHAR(20) NOT NULL UNIQUE,
    hourly_fare INTEGER     NOT NULL
        CHECK (hourly_fare > 0),
    PRIMARY KEY (carpark_id)
);

CREATE TABLE IF NOT EXISTS parking_space
(
    parking_space_id  SERIAL,
    carpark_id        SERIAL NOT NULL,
    latitude          FLOAT  NOT NULL,
    longitude         FLOAT  NOT NULL,
    blocked           BOOLEAN DEFAULT false,
    occupant_username VARCHAR(20),
    PRIMARY KEY (parking_space_id),
    FOREIGN KEY (carpark_id) REFERENCES carpark (carpark_id)
        ON DELETE RESTRICT,
    FOREIGN KEY (occupant_username) REFERENCES app_user (username)
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS booking
(
    booking_id       SERIAL,
    parking_space_id INTEGER           NOT NULL,
    booking_username CHAR(20)          NOT NULL,
    start            TIMESTAMP         NOT NULL,
    finish           TIMESTAMP         NOT NULL,
    deposit          INTEGER DEFAULT 0 NOT NULL,
    PRIMARY KEY (booking_id),
    FOREIGN KEY (parking_space_id) REFERENCES parking_space (parking_space_id)
        ON DELETE RESTRICT,
    FOREIGN KEY (booking_username) REFERENCES app_user (username)
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS transaction
(
    transaction_id      SERIAL,
    transactor_username VARCHAR(20)                         NOT NULL,
    amount              INTEGER                             NOT NULL,
    timestamp           TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (transaction_id),
    FOREIGN KEY (transactor_username) REFERENCES app_user (username)
        ON DELETE CASCADE
);

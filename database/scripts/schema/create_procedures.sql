-- !psql

CREATE OR REPLACE PROCEDURE generate_alerts()
    LANGUAGE plpgsql
AS
$$
DECLARE
    username VARCHAR(20);
    row      booking%rowtype;
BEGIN
    -- For when a user is an hour late
    FOR row IN SELECT *
               FROM booking
               WHERE visited = false
                 AND start + INTERVAL '1 hour' < CURRENT_TIMESTAMP
                 AND start < CURRENT_TIMESTAMP
                 AND CURRENT_TIMESTAMP < finish
        LOOP
            INSERT INTO alert (message)
            VALUES ('User ' || row.booking_username || ' is late for their booking.');
        END LOOP;

    -- For when a user has not left their parking space an hour after their booking
    FOR row IN SELECT *
               FROM booking
               JOIN parking_space
               ON booking.parking_space_id = parking_space.parking_space_id
               WHERE visited = true
                 AND occupant_username = booking.booking_username
                 AND finish < CURRENT_TIMESTAMP
                 -- AND finish + INTERVAL '1 hour' < CURRENT_TIMESTAMP
        LOOP
            INSERT INTO alert (message)
            VALUES ('User ' || row.booking_username || E' hasn\'t left their parking space.');
        END LOOP;
END;
$$;

CALL generate_alerts();

-- !psql

CREATE OR REPLACE FUNCTION calculate_booking_deposit(
    start_in TIMESTAMP,
    finish_in TIMESTAMP,
    parking_space_id_in INTEGER
)
    RETURNS INTEGER
    LANGUAGE plpgsql
AS
$$
DECLARE
    rate INTEGER;
BEGIN
    SELECT hourly_fare
    INTO rate
    FROM carpark cp
             JOIN parking_space ps ON
        cp.carpark_id = ps.carpark_id
    WHERE ps.parking_space_id = parking_space_id_in;

    IF rate IS NULL THEN
        RAISE EXCEPTION 'Parking space not found.';
    END IF;

    -- Calculate hourly rate
    RETURN CEIL(EXTRACT(EPOCH FROM (finish_in - start_in)) / 3600) * rate;
END;
$$;


-- Assumes that start_in and finish_in are valid times
CREATE OR REPLACE FUNCTION check_if_available(
    parking_space_id_in INTEGER,
    start_in TIMESTAMP,
    finish_in TIMESTAMP
)
    RETURNS BOOLEAN
    LANGUAGE plpgsql
AS
$$
BEGIN
    -- Check if the space is taken in another booking
    IF EXISTS (SELECT
               FROM booking
               WHERE parking_space_id_in = booking.parking_space_id
                 AND (start_in, finish_in) OVERLAPS (booking.start, booking.finish)) THEN
        RETURN false;
    END IF;

    -- Check if space is available
    IF EXISTS(SELECT 1 FROM parking_space WHERE status != 'active') THEN
        RETURN false;
    END IF;
    RETURN true;
END;
$$;


CREATE OR REPLACE FUNCTION get_parking_spaces_by_distance(
    longitude_in FLOAT,
    latitude_in FLOAT
)
    RETURNS TABLE
            (
                parking_space_id INTEGER,
                distance         FLOAT
            )
    LANGUAGE plpgsql
AS
$$
BEGIN
    -- Find the closest available parking space
    RETURN QUERY
        SELECT ps.parking_space_id,
               earth_distance(
                       ll_to_earth(latitude_in, longitude_in),
                       ll_to_earth(ps.latitude, ps.longitude)
               ) AS distance
        FROM parking_space ps
        ORDER BY distance;
END;
$$;


-- Will return NULL if there are no parking spaces available anymore
CREATE OR REPLACE FUNCTION get_nearest_available_parking_space(
    longitude_in FLOAT,
    latitude_in FLOAT,
    start_in TIMESTAMP,
    finish_in TIMESTAMP
)
    RETURNS INTEGER
    LANGUAGE plpgsql
AS
$$
DECLARE
    nearest_parking_space_id INTEGER;
BEGIN
    SELECT sorted.parking_space_id
    INTO nearest_parking_space_id
    FROM get_parking_spaces_by_distance(
                 longitude_in,
                 latitude_in) AS sorted
    WHERE check_if_available(sorted.parking_space_id, start_in, finish_in)
    LIMIT 1;
    RETURN nearest_parking_space_id;
END;
$$;

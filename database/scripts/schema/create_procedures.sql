-- !psql

CREATE OR REPLACE PROCEDURE create_booking(
    IN parking_space_id_in INTEGER,
    IN registration_in VARCHAR(7),
    IN start_in TIMESTAMP,
    IN finish_in TIMESTAMP
)
    LANGUAGE plpgsql AS
$$
DECLARE
    charge             INTEGER;
    new_transaction_id INTEGER;
BEGIN
    -- Atomic transactions
    -- Calculate charge
    SELECT booking_cost
    FROM carpark
             JOIN parking_space ON parking_space_id_in = parking_space.parking_space_id
    INTO charge;

    -- Deduct funds
    UPDATE app_user
    SET balance = balance - charge
    FROM vehicle
    WHERE app_user.username = vehicle.owner_username
      AND vehicle.registration = registration_in;

    -- Get the generated transaction
    SELECT MAX(transaction_id)
    FROM transaction
    INTO new_transaction_id;

    -- Create booking
    INSERT INTO booking (parking_space_id, registration, start, finish, transaction_id)
    VALUES (parking_space_id_in, registration_in, start_in, finish_in, new_transaction_id);
END;
$$;

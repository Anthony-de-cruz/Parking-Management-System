-- !psql

CREATE OR REPLACE FUNCTION validate_booking()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    -- Check if the finish time is before the start time
    IF (NEW.finish <= NEW.start) THEN
        RAISE EXCEPTION 'Invalid start and finish times.';
    END IF;
    -- Check if the space is booked
    IF EXISTS (SELECT
               FROM booking
               WHERE NEW.parking_space_id = booking.parking_space_id
                 AND (
                   (NEW.start, NEW.finish) OVERLAPS (booking.start, booking.finish)
                   )) THEN
        RAISE EXCEPTION 'The space is already booked for this time.';
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER validate_booking
    BEFORE INSERT OR UPDATE
    ON booking
    FOR EACH ROW
EXECUTE FUNCTION validate_booking();


CREATE OR REPLACE FUNCTION validate_transaction()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    -- Check if the user has enough money for a negative transaction
    IF (NEW.amount < 0) THEN
        IF (SELECT 1
            FROM transaction
                     JOIN app_user ON NEW.username = app_user.username
                AND ABS(NEW.amount) > app_user.balance) THEN
            RAISE EXCEPTION 'Not enough money to perform transaction.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER validate_transaction
    BEFORE INSERT OR UPDATE
    ON transaction
    FOR EACH ROW
EXECUTE FUNCTION validate_transaction();


CREATE OR REPLACE FUNCTION record_balance_change()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    -- Check if the balance is changing
    IF NEW.balance <> OLD.balance THEN
        INSERT INTO transaction (username, amount)
        VALUES (NEW.username, NEW.balance - OLD.balance);
    END IF;
    RETURN NEW;
END;
$$;



CREATE TRIGGER record_balance_change
BEFORE UPDATE OF balance ON app_user
FOR EACH ROW
EXECUTE FUNCTION record_balance_change();

CREATE OR REPLACE FUNCTION refund_booking()
    LANGUAGE plpgsql
AS
$$
DECLARE
    charge INTEGER;
BEGIN
--     UPDATE app_user
--     SET balance = balance + charge
--     WHERE OLD.registration = app_user.username
END;
$$;

CREATE TRIGGER refund_booking_deletion
    AFTER DELETE ON booking
    FOR EACH ROW
    EXECUTE FUNCTION refund_booking();
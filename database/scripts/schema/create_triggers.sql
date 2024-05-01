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

    -- Check if the space is taken in another booking
    IF EXISTS (SELECT
               FROM booking
               WHERE NEW.parking_space_id = booking.parking_space_id
                 AND NEW.booking_id != booking.booking_id
                 AND (
                   (NEW.start, NEW.finish) OVERLAPS (booking.start, booking.finish)
                   )) THEN
        RAISE EXCEPTION 'The space is already booked for this time.';
    END IF;

    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER validate_booking
    BEFORE INSERT OR UPDATE
    ON booking
    FOR EACH ROW
EXECUTE FUNCTION validate_booking();


CREATE OR REPLACE FUNCTION withdraw_deposit()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
DECLARE
    new_deposit INTEGER;
BEGIN
    new_deposit = calculate_booking_deposit(
            NEW.start,
            NEW.finish,
            NEW.parking_space_id);
    RAISE NOTICE 'hi %', new_deposit;
    UPDATE app_user
    SET balance = balance - new_deposit
    WHERE app_user.username = NEW.booking_username;

    NEW.deposit = new_deposit;

    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER withdraw_deposit
    BEFORE INSERT
    ON booking
    FOR EACH ROW
EXECUTE FUNCTION withdraw_deposit();


CREATE OR REPLACE FUNCTION update_deposit()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
DECLARE
    new_deposit INTEGER;
BEGIN
    new_deposit = calculate_booking_deposit(
            NEW.start,
            NEW.finish,
            NEW.parking_space_id);

    -- If the deposit changes, update the users balance
    IF new_deposit != OLD.deposit THEN
        UPDATE app_user
        SET balance = balance + OLD.deposit - new_deposit
        WHERE app_user.
                  username = NEW.booking_username;
        NEW.deposit = new_deposit;
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER update_deposit
    BEFORE UPDATE
    ON booking
    FOR EACH ROW
EXECUTE FUNCTION update_deposit();


CREATE OR REPLACE FUNCTION refund_deposit()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    -- Check to see if the booking timeslot has already begun
    IF (OLD.start < CURRENT_TIMESTAMP) THEN
        RETURN OLD;
    END IF;

    -- Refund deposit
    UPDATE app_user
    SET balance = balance + OLD.deposit
    WHERE app_user.username = OLD.booking_username;
    RETURN OLD;
END;
$$;

CREATE OR REPLACE TRIGGER refund_deposit
    BEFORE DELETE
    ON booking
    FOR EACH ROW
EXECUTE FUNCTION refund_deposit();


CREATE OR REPLACE FUNCTION record_balance_change()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    -- Check if the balance is changing
    IF NEW.balance <> OLD.balance THEN
        INSERT INTO transaction (transactor_username, amount)
        VALUES (NEW.username, NEW.balance - OLD.balance);
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER balance_change
    BEFORE UPDATE OF balance
    ON app_user
    FOR EACH ROW
EXECUTE FUNCTION record_balance_change();


CREATE OR REPLACE FUNCTION record_balance_on_insert()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    INSERT INTO transaction (transactor_username, amount)
    VALUES (NEW.username, NEW.balance);
    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER record_balance_on_insert
    AFTER INSERT
    ON app_user
    FOR EACH ROW
EXECUTE FUNCTION record_balance_on_insert();


CREATE OR REPLACE FUNCTION validate_transaction()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    -- Check if the user has enough money for a negative transaction
    IF NEW.amount < 0 THEN
        IF ABS(NEW.amount) > (SELECT balance
                              FROM app_user
                              WHERE NEW.transactor_username = app_user.username) THEN
            RAISE EXCEPTION 'Not enough money to perform transaction.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER validate_transaction
    BEFORE INSERT OR UPDATE
    ON transaction
    FOR EACH ROW
EXECUTE FUNCTION validate_transaction();

var databaseManager = require("../controllers/databaseManager");
const { query } = databaseManager;

const User = require("../models/user");
const Booking = require("../models/booking");

class UserController {
  constructor() {}

  static async createBooking(req, res, next) {
    console.log("User data in createBooking:", req.user); // Check if req.user is available

    try {
      // Extract data from request body
      const { parkingSpaceID, start, finish } = req.body;
      console.log("Received data:", { parkingSpaceID, start, finish });

      // Ensure user data is available
      if (!req.user || !req.user.username) {
        console.error("User data is missing or invalid");
        return res
          .status(401)
          .json({ error: "User data is missing or invalid" });
      }

      // Extract username from user data
      const bookingUsername = req.user.username;

      // Check the status of the selected parking space
      const parkingSpaceStatusRes = await query(
        `SELECT status FROM parking_space WHERE parking_space_id = $1`,
        [parkingSpaceID],
      );

      const parkingSpaceStatus = parkingSpaceStatusRes.rows[0]?.status;
      if (!parkingSpaceStatus) {
        return res.status(400).json({ error: "Invalid parking space ID" });
      }

      if (
        parkingSpaceStatus === "blocked" ||
        parkingSpaceStatus === "reserved"
      ) {
        return res.status(400).json({
          error: "The selected parking space is currently blocked or reserved.",
        });
      }

      // Insert the booking request into the database with approved flag set to false
      await query(
        `INSERT INTO booking (parking_space_id, booking_username, start, finish, approved) 
          VALUES ($1, $2, $3, $4, $5)`,
        [parkingSpaceID, bookingUsername, start, finish, false],
      );

      // Return success response
      req.resultMsg = "Booking created successfully";
      return next();
    } catch (error) {
      // Handle any errors
      console.error("Error creating booking:", error);
      req.resultMsg = "Failed to create booking";
      return next();
    }
  }

  static async calcualteBooking(req, res, next) {
    try {
      // Extract data from request body
      const { latitude, longitude, start, finish } = req.body;
      console.log("Received data:", { latitude, longitude, start, finish });

      // Extract username from user data
      const bookingUsername = req.user.username;

      const nearestIDRes = await query(
        `SELECT get_nearest_available_parking_space($1, $2, $3, $4) AS id;`,
        [longitude, latitude, start, finish],
      );

      const nearestID = nearestIDRes.rows[0].id;
      console.log("id: " + nearestID);

      const costRes = await query(
        `SELECT calculate_booking_deposit($1, $2, $3) AS cost;`,
        [start, finish, nearestID],
      );

      const bookingCost = costRes.rows[0].cost;
      console.log("cost: " + bookingCost);

      const newBooking = new Booking(
        0,
        nearestID,
        bookingUsername,
        start,
        finish,
        bookingCost,
      );

      req.newBooking = newBooking;
      req.calculatedBooking = true;

      console.log(
        "Booking cost calculated as: " + nearestID + ", " + bookingCost,
      );
      return next();
    } catch (error) {
      // Handle any errors
      req.resultMsg = "Failed to calculate booking";
      return next();
    }
  }

  static async showBooking(req, res, next) {
    try {
      const bookingUsername = req.user.username;

      // Fetch bookings from the database
      const bookings = await query(
        `SELECT * FROM booking WHERE booking_username = $1 AND approved = true`,        
        [bookingUsername],
      );

      req.bookings = bookings.rows;

      return next();
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).send("Error fetching bookings");
    }
  }

  static async updateBookingDetails(req, res, next) {
    try {
      const { bookingID, parkingSpaceID, start, finish } = req.body;

        await query(
        `UPDATE booking 
         SET parking_space_id = $1, start = $2, finish = $3 
         WHERE booking_id = $4`,
        [parkingSpaceID, start, finish, bookingID],
      );
  
      // Set success message
      req.resultMsg = "Booking details updated successfully";
    } catch (error) {
      // Set error message
      console.error("Error updating booking details:", error);
      req.resultMsg = "Failed to update booking details";
    }
    next();
  }
  
  static async selectBooking(req, res, next) {
    const { bookingID } = req.body;
    const username = req.user.username;

    console.log(req.user.username);

    try {
      const bookingQuery = await query(
        `
          SELECT latitude,
                 longitude,
                 carpark.name AS carpark_name,
                 booking.parking_space_id
          FROM booking
                   JOIN parking_space
                        ON booking.booking_id = $1 AND
                           booking.booking_username = $2 AND
                           parking_space.parking_space_id = booking.parking_space_id
                   JOIN carpark
                        ON carpark.carpark_id = parking_space.carpark_id;
        `,
        [bookingID, username],
      );

      if (bookingQuery.rowCount != 1) {
        req.errorMsg = "Booking not found";
        return next();
      }

      const bookingData = bookingQuery.rows[0];

      req.bookingSelected = true;
      req.targetLatitude = bookingData.latitude;
      req.targetLongitude = bookingData.longitude;
      req.targetCarpark = bookingData.carpark_name;
      req.targetParkingSpace = bookingData.parking_space_id;
    } catch (error) {
      console.log(error);
      req.errorMsg = "Internal server error";
    }
    return next();
  }

  static async park(req, res, next) {
    const {
      targetLatitude,
      targetLongitude,
      targetParkingSpace,
      targetCarpark,
      currentLatitude,
      currentLongitude,
    } = req.body;
    const username = req.user.username;

    req.targetLatitude = targetLatitude;
    req.targetLongitude = targetLongitude;
    req.targetCarpark = targetCarpark;
    req.targetParkingSpace = targetParkingSpace;

    try {
      const distanceQuery = await query(
        `
          SELECT distance
          FROM get_parking_spaces_by_distance($1, $2) AS sorted
                   JOIN booking
                        ON booking.parking_space_id = sorted.parking_space_id
          WHERE sorted.parking_space_id = $3
            AND booking.approved = true;`,
        [currentLongitude, currentLatitude, targetParkingSpace],
      );

      if (distanceQuery.rowCount != 1) {
        req.errorMsg = "Invalid booking";
        return next();
      }

      const distance = distanceQuery.rows[0].distance;
      console.log(distanceQuery);
      console.log(distance);

      if (distance > 5) {
        req.errorMsg =
          "You are " + (distance - 5) + "m away from the parking space";
        return next();
      }

      const queryResult = await query(
        `
          UPDATE parking_space
          SET occupant_username = $1,
              status            = 'occupied'
          WHERE parking_space_id = $2
            AND occupant_username IS NULL
            AND  status = 'active'
          RETURNING status;
        `,
        [username, targetParkingSpace],
      );

      if (queryResult.rowCount != 1) {
        req.errorMsg = "Space unavailable";
        return next();
      }

      req.parkSuccessMsg = "You have parked!";
    } catch (error) {
      console.log(error);
      req.errorMsg = "Internal server error";
    }
    return next();
  }

  static async unpark(req, res, next) {
    const { parkingSpaceID } = req.body;
    const username = req.user.username;

    try {
      queryResult = await query(
        `
          UPDATE parking_space
          SET occupant_username = NULL,
              status = 'active'
          WHERE parking_space_id = $1
            AND occupant_username = $2;
        `,
        [parkingSpaceID, username],
      );

      if (queryResult.rowCount != 1) {
        req.resultMsg = "Invalid parking space id";
        return next();
      }

      req.resultMsg = "Successful";
      console.log(
        "Removed user " + username + " from parking space " + parkingSpaceID,
      );
    } catch (error) {
      req.resultMsg = "Invalid parking space id";
      console.log("Invalid unparking: " + error);
    }

    return next();
  }
}

module.exports = UserController;

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
      const { parkingSpaceID, start, finish, deposit } = req.body;
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

      // Insert the booking into the database
      await query(
        `INSERT INTO booking (parking_space_id, booking_username, start, finish) 
         VALUES ($1, $2, $3, $4)`,
        [parkingSpaceID, bookingUsername, start, finish],
      );

      // Return success response
      return res.status(200).json({ message: "Booking created successfully" });
    } catch (error) {
      // Handle any errors
      console.error("Error creating booking:", error);
      return res.status(500).json({ error: "Failed to create booking" });
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
      console.error("Error checking booking:", error);
      return res.status(500).json({ error: "Failed to check booking cost" });
    }
  }

  static async showBooking(req, res, next) {
    try {
      const bookingUsername = req.user.username;
  
      // Fetch bookings from the database
      const bookings = await query(
        `SELECT * FROM booking WHERE booking_username = $1`,
        [bookingUsername],
      );
      
      req.bookings = bookings.rows;

      return next();
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).send("Error fetching bookings");
    }
  }
}

module.exports = UserController;

var databaseManager = require("../controllers/databaseManager");
const { query } = databaseManager;

class UserController {
  constructor() {}

  static async createBooking(req, res, next) {
    console.log("User data in createBooking:", req.user); // Check if req.user is available

    const { parkingSpaceID, start, finish, deposit } = req.body;
    const bookingUsername = req.user.username;

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
}

module.exports = UserController;

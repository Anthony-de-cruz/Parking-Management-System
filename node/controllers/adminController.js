var databaseManager = require("../controllers/databaseManager");
const { query } = databaseManager;

class AdminController {
  static async getParkingSpaces(req, res, next) {
    try {
      const result = await query(
        `SELECT parking_space_id, status FROM parking_space`,
      );
      req.parkingSpaces = result.rows;
      next();
    } catch (error) {
      console.error("Error fetching parking spaces:", error);
      res.status(500).send("Error fetching parking spaces");
    }
  }

  static async addParkingSpace(req, res) {
    const { parking_space_id, latitude, longitude, carpark_id } = req.body;
    try {
      await query(
        `INSERT INTO parking_space (parking_space_id, carpark_id, latitude, longitude, status) VALUES ($1, $2, $3, $4, 'active')`,
        [parking_space_id, carpark_id, latitude, longitude],
      );
      res.redirect("/admin-manage-parking");
    } catch (error) {
      console.error("Error adding parking space:", error);

      let errorMessage;
      if (error.code === "23505") {
        // PostgreSQL error code for unique violation
        errorMessage = "Parking space ID is already occupied.";
      } else if (error.code === "23503") {
        // PostgreSQL error code for foreign key violation
        errorMessage = "The specified Carpark ID does not exist.";
      } else {
        errorMessage = "Error adding parking space.";
      }

      // Re-fetch parking spaces to pass to the view
      const result = await query(
        `SELECT parking_space_id, status FROM parking_space`,
      );
      req.parkingSpaces = result.rows;

      res.render("adminManageParking", {
        loggedIn: req.loggedIn,
        user: req.user,
        parkingSpaces: req.parkingSpaces,
        errorMessage,
      });
    }
  }

  static async removeParkingSpace(req, res, next) {
    const { parking_space_id } = req.body;
    try {
      await query(`DELETE FROM parking_space WHERE parking_space_id = $1`, [
        parking_space_id,
      ]);
      next(); // Call next middleware
    } catch (error) {
      console.error("Error removing parking space:", error);
      next(error); // Pass error to next middleware
    }
  }

  static async toggleBlock(req, res, next) {
    const { parking_space_id } = req.body;
    try {
      const result = await query(
        `SELECT status FROM parking_space WHERE parking_space_id = $1`,
        [parking_space_id],
      );
      const parkingSpace = result.rows[0];
      if (!parkingSpace) {
        throw new Error("Parking space not found");
      }
  
      const originalStatus = parkingSpace.status;
      const newStatus = originalStatus === "blocked" ? "active" : "blocked";
  
      await query(
        `UPDATE parking_space SET status = $1 WHERE parking_space_id = $2`,
        [newStatus, parking_space_id],
      );
  
      req.body.originalStatus = originalStatus;
      req.body.newStatus = newStatus;
      next(); // Call next middleware
    } catch (error) {
      console.error("Error toggling block:", error.message);
      next(error); // Pass error to next middleware
    }
  }
  
  static async reserve(req, res, next) {
    const { parking_space_id } = req.body;
    try {
      const result = await query(
        `SELECT status FROM parking_space WHERE parking_space_id = $1`,
        [parking_space_id],
      );
      const parkingSpace = result.rows[0];
      if (!parkingSpace) {
        throw new Error("Parking space not found");
      }
  
      const originalStatus = parkingSpace.status;
      const newStatus = originalStatus === "reserved" ? "active" : "reserved";
  
      await query(
        `UPDATE parking_space SET status = $1 WHERE parking_space_id = $2`,
        [newStatus, parking_space_id],
      );
  
      req.body.originalStatus = originalStatus;
      req.body.newStatus = newStatus;
      next(); // Call next middleware
    } catch (error) {
      console.error("Error toggling reserve:", error.message);
      next(error); // Pass error to next middleware
    }
  }

  static async banUser(username) {
    await query("UPDATE app_user SET is_banned = True WHERE username = $1;", [
      username,
    ]);
  }

  static async unbanUser(username) {
    await query("UPDATE app_user SET is_banned = False WHERE username = $1;", [
      username,
    ]);
  }

  static async deleteUser(username) {
    try {
      await query("DELETE FROM booking WHERE booking_username = $1;", [
        username,
      ]);
      await query("DELETE FROM app_user WHERE username = $1;", [username]);
    } catch (error) {
      throw new Error("Failed to delete user: " + error.message);
    }
  }

  static async getUsers() {
    try {
      const result = await query("SELECT * FROM app_user;");
      return result.rows;
    } catch (error) {
      throw new Error("Failed to fetch users: " + error.message);
    }
  }

  static async getParkingSpaceStatus(req, res, next) {
    try {
      const result = await query(`
        SELECT 
          COUNT(*) AS total_spaces,
          COUNT(*) FILTER (WHERE status = 'active') AS available_spaces,
          COUNT(*) FILTER (WHERE status = 'occupied') AS occupied_spaces,
          COUNT(*) FILTER (WHERE status = 'reserved') AS reserved_spaces,
          COUNT(*) FILTER (WHERE status = 'blocked') AS blocked_spaces
        FROM parking_space;
      `);

      req.parkingSpaceStatus = result.rows[0];
      next();
    } catch (error) {
      console.error("Error getting parking space status:", error);
      res.status(500).send("Error getting parking space status");
    }
  }

  static async getBookingRequests(req, res, next) {
    try {
      const result = await query(
        `SELECT booking_id, parking_space_id, booking_username, start, finish 
         FROM booking 
         WHERE approved = FALSE`,
      );
      req.bookingRequests = result.rows;
      next();
    } catch (error) {
      console.error("Error fetching booking requests:", error);
      res.status(500).send("Error fetching booking requests");
    }
  }

  static async approveBookingRequest(req, res) {
    const { bookingID } = req.body;
    try {
      await query(`UPDATE booking SET approved = TRUE WHERE booking_id = $1`, [
        bookingID,
      ]);
      res.redirect("/admin-parking-requests");
    } catch (error) {
      console.error("Error approving booking request:", error);
      res.status(500).send("Error approving booking request");
    }
  }

  static async denyBookingRequest(req, res) {
    const { bookingID } = req.body;
    try {
      await query(`DELETE FROM booking WHERE booking_id = $1`, [bookingID]);
      res.redirect("/admin-parking-requests");
    } catch (error) {
      console.error("Error denying booking request:", error);
      res.status(500).send("Error denying booking request");
    }
  }

  static async getAdminAlerts(req, res, next) {
    const { bookingID } = req.body;
    try {
      const result = await query("SELECT * FROM alert;");
      if (result.rows.length > 0) {
        req.resultMsg = "Your alerts";
      } else {
        req.resultMsg = "No alerts";
      }
      // MAKE THE TABLE HERE
    } catch (error) {
      console.error("Error checking for alerts:", error);
      req.resultMsg = "Failed to check for alerts!";
    }

    return next();
  }
  static async generateAlert(req, res, next) {
    const result = await query("CALL generate_alerts();");
    try {
      if (result.rows.length === 0) {
        req.resultMsg = "There are no alerts";
      }
    } catch (error) {
      console.error("Error checking for late bookings:", error);
      req.resultMsg = "Failed to check for late bookings!";
    }
    return next();
  }
}

module.exports = AdminController;

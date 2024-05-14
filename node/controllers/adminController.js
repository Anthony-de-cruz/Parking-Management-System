var databaseManager = require("../controllers/databaseManager");
const { query } = databaseManager;

class AdminController {
  static async getParkingBookings(req, res, next) {
    try {
      const result = await query(
        `SELECT booking.booking_id, booking.parking_space_id, booking.start, booking.finish, booking.booking_username, ps.blocked, booking.status
         FROM booking
         JOIN parking_space ps ON booking.parking_space_id = ps.parking_space_id`
      );
      req.bookings = result.rows;
      next();
    } catch (error) {
      console.error("Error fetching parking bookings:", error);
      res.status(500).send("Error fetching parking bookings");
    }
  }

  static async removeBooking(req, res) {
    const { booking_id } = req.body;
    try {
      await query(`DELETE FROM booking WHERE booking_id = $1`, [booking_id]);
      res.redirect('/admin-manage-parking');
    } catch (error) {
      console.error("Error removing booking:", error);
      res.status(500).send("Error removing booking");
    }
  }

  static async toggleBlock(req, res) {
    const { booking_id } = req.body;
    try {
      const result = await query(
        `SELECT parking_space_id FROM booking WHERE booking_id = $1`,
        [booking_id]
      );
      const booking = result.rows[0];
      if (!booking) {
        throw new Error("Booking not found");
      }
  
      const parkingSpaceResult = await query(
        `SELECT blocked FROM parking_space WHERE parking_space_id = $1`,
        [booking.parking_space_id]
      );
      const parkingSpace = parkingSpaceResult.rows[0];
      if (!parkingSpace) {
        throw new Error("Parking space not found");
      }
  
      const isBlocked = parkingSpace.blocked;
  
      if (isBlocked) {
        await query(
          `UPDATE parking_space SET blocked = false WHERE parking_space_id = $1`,
          [booking.parking_space_id]
        );
        await query(
          `UPDATE booking SET status = 'active' WHERE booking_id = $1`,
          [booking_id]
        );
      } else {
        await query(
          `UPDATE parking_space SET blocked = true WHERE parking_space_id = $1`,
          [booking.parking_space_id]
        );
        await query(
          `UPDATE booking SET status = 'blocked' WHERE booking_id = $1`,
          [booking_id]
        );
      }
  
      res.redirect('/admin-manage-parking');
    } catch (error) {
      console.error("Error toggling block:", error.message);
      res.status(500).send(`Error toggling block: ${error.message}`);
    }
  }
  

  static async reserve(req, res) {
    const { booking_id } = req.body;
    try {
      const result = await query(
        `SELECT booking_username FROM booking WHERE booking_id = $1`,
        [booking_id]
      );
      const booking = result.rows[0];
      if (!booking) {
        throw new Error("Booking not found");
      }

      await query(
        `UPDATE booking SET status = 'reserve' WHERE booking_id = $1`,
        [booking_id]
      );
      res.redirect('/admin-manage-parking');
    } catch (error) {
      console.error("Error reserving booking:", error.message);
      res.status(500).send(`Error reserving booking: ${error.message}`);
    }
  }

  static async banUser(username) {
    await query("UPDATE app_user SET is_banned = True WHERE username = $1;", [username]);
  }

  static async unbanUser(username) {
    await query("UPDATE app_user SET is_banned = False WHERE username = $1;", [username]);
  }

  static async deleteUser(username) {
    try {
      await query("DELETE FROM booking WHERE booking_username = $1;", [username]);
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
}

module.exports = AdminController;

var databaseManager = require("../controllers/databaseManager");
const { query } = databaseManager;

class AdminController {

  static async getParkingSpaces(req, res, next) {
    try {
      const result = await query(`SELECT parking_space_id, status FROM parking_space ORDER BY parking_space_id`);
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
      await query(`INSERT INTO parking_space (parking_space_id, carpark_id, latitude, longitude, status) VALUES ($1, $2, $3, $4, 'active')`, [parking_space_id, carpark_id, latitude, longitude]);
      res.redirect('/admin-manage-parking');
    } catch (error) {
      console.error("Error adding parking space:", error);
  
      let errorMessage;
      if (error.code === '23505') { // PostgreSQL error code for unique violation
        errorMessage = 'Parking space ID is already occupied.';
      } else if (error.code === '23503') { // PostgreSQL error code for foreign key violation
        errorMessage = 'The specified Carpark ID does not exist.';
      } else {
        errorMessage = 'Error adding parking space.';
      }
  
      // Re-fetch parking spaces to pass to the view
      const result = await query(`SELECT parking_space_id, status FROM parking_space ORDER BY parking_space_id`);
      req.parkingSpaces = result.rows;
  
      res.render("adminManageParking", { 
        loggedIn: req.loggedIn, 
        user: req.user, 
        parkingSpaces: req.parkingSpaces, 
        errorMessage 
      });
    }
  }
  
  static async removeParkingSpace(req, res) {
    const { parking_space_id } = req.body;
    try {
      await query(`DELETE FROM parking_space WHERE parking_space_id = $1`, [parking_space_id]);
      res.redirect('/admin-manage-parking');
    } catch (error) {
      console.error("Error removing parking space:", error);
      res.status(500).send("Error removing parking space");
    }
  }

  static async toggleBlock(req, res) {
    const { parking_space_id } = req.body;
    try {
      const result = await query(`SELECT status FROM parking_space WHERE parking_space_id = $1`, [parking_space_id]);
      const parkingSpace = result.rows[0];
      if (!parkingSpace) {
        throw new Error("Parking space not found");
      }

      const isBlocked = parkingSpace.status === 'blocked';
      const newStatus = isBlocked ? 'active' : 'blocked';
      
      await query(`UPDATE parking_space SET status = $1 WHERE parking_space_id = $2`, [newStatus, parking_space_id]);
      
      res.redirect('/admin-manage-parking');
    } catch (error) {
      console.error("Error toggling block:", error.message);
      res.status(500).send(`Error toggling block: ${error.message}`);
    }
  }

  static async reserve(req, res) {
    const { parking_space_id } = req.body;
    try {
      const result = await query(`SELECT status FROM parking_space WHERE parking_space_id = $1`, [parking_space_id]);
      const parkingSpace = result.rows[0];
      if (!parkingSpace) {
        throw new Error("Parking space not found");
      }
  
      const isReserved = parkingSpace.status === 'reserved';
      const newStatus = isReserved ? 'active' : 'reserved';
      
      await query(`UPDATE parking_space SET status = $1 WHERE parking_space_id = $2`, [newStatus, parking_space_id]);
      
      res.redirect('/admin-manage-parking');
    } catch (error) {
      console.error("Error toggling reserve:", error.message);
      res.status(500).send(`Error toggling reserve: ${error.message}`);
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

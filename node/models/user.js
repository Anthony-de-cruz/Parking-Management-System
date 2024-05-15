const databaseManager = require("../controllers/databaseManager");
const { query } = databaseManager;
const { sendEmail } = require('../controllers/emailService');

class User {
  constructor(username, password, email, isAdmin, isBanned, balance) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.isAdmin = isAdmin;
    this.isBanned = isBanned;
    this.balance = balance;
  }

  static async buildFromDB(username) {
    const result = await query("SELECT * FROM app_user WHERE username = $1;", [username]);
    if (result.rowCount != 1) {
      throw new Error("Username not found in DB");
    }
    const userData = result.rows[0];

    return new User(
      userData.username,
      userData.password,
      userData.email,
      userData.is_admin,
      userData.is_banned,
      userData.balance,
    );
  }

  static async updatePassword(username, newPassword) {
    await query("UPDATE app_user SET password = $1 WHERE username = $2;", [newPassword, username]);
  }

  static async updateEmail(username, newEmail) {
    // Fetch the current user data from the database
    const user = await this.buildFromDB(username);

    // Update the email in the database
    await query("UPDATE app_user SET email = $1 WHERE username = $2;", [newEmail, username]);

    // Send notification emails
    const oldEmail = user.email;
    const subject = 'Email Change Notification';
    const oldEmailText = `Your email has been changed from ${oldEmail} to ${newEmail}. If this was not you, please contact support immediately.`;
    const newEmailText = `Your email has been successfully changed to ${newEmail}. If this was not you, please contact support immediately.`;

    await sendEmail(oldEmail, subject, oldEmailText);
    await sendEmail(newEmail, subject, newEmailText);
  }

  static async updateBalance(username, newBalance) {
    try {
      await query(`UPDATE app_user SET balance = $1 WHERE username = $2`, [newBalance, username]);
    } catch (error) {
      throw new Error("Failed to update user balance: " + error.message);
    }
  }
}

module.exports = User;

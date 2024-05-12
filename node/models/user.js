var databaseManager = require("../controllers/databaseManager");
const { query } = databaseManager;

class User {
  constructor(username, password, email, isAdmin, isBanned, balance) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.isAdmin = isAdmin;
    this.isBanned = isBanned;
    this.balance = balance;
  }

  /**
   * Build an instance from a prexisting DB record
   */
  static async buildFromDB(username) {
    const result = await query("SELECT * FROM app_user WHERE username = $1;", [
      username,
    ]);
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


static async updateBalance(username, newBalance) {
  try {
    await query(`UPDATE app_user SET balance = $1 WHERE username = $2`, [newBalance, username]);
  } catch (error) {
    throw new Error("Failed to update user balance: " + error.message);
  }
}
}

module.exports = User;

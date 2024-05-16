const twilio = require('twilio');
const databaseManager = require("./databaseManager");
const { query } = databaseManager;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);


class MessageController {
  static async sendMessageToAdmin(user, message) {
    const adminPhoneNumber = await MessageController.getAdminPhoneNumber();
    return client.messages.create({
      body: `${message} -From ${user.username}`,
      from: '+447883316354',
      to: adminPhoneNumber,
    });
  }

  static async sendMessageToUser(username, message) {
    const phoneNumber = await MessageController.getUserPhoneNumber(username);
    return client.messages.create({
      body: `${message} -From Admin`,
      from: '+447883316354',
      to: phoneNumber,
    });
  }

  static async getAdminPhoneNumber() {
    const result = await query("SELECT phone_number FROM app_user WHERE is_admin = TRUE LIMIT 1;");
    if (result.rowCount === 0) {
      throw new Error("Admin phone number not found");
    }
    return result.rows[0].phone_number;
  }

  static async getUserPhoneNumber(username) {
    const result = await query("SELECT phone_number FROM app_user WHERE username = $1;", [username]);
    if (result.rowCount === 0) {
      throw new Error("User phone number not found");
    }
    return result.rows[0].phone_number;
  }
}

module.exports = MessageController;

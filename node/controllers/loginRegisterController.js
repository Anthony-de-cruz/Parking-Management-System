const jwt = require("jsonwebtoken");

var User = require("../models/user");

var databaseManager = require("../controllers/databaseManager");
const { query } = databaseManager;

class LoginRegisterController {
  constructor() {}

  /**
   * Register a new user
   */
  static async registerUser(username, password, email, phone_number) {
    try {
      await query(
        `INSERT INTO app_user (username, password, email, phone_number, is_admin, is_banned, balance)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [username, password, email, phone_number, false, false, 0],
      );
      console.log(`Inserted new user: ${username}, ${password}, ${email}, ${phone_number}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate a new auth token and save it as a cookie
   */
  static generateAuthToken(res, username, isAdmin) {
    const token = jwt.sign(
      { username: username, isAdmin: isAdmin },
      "super-secret",
      {
        expiresIn: "3h",
      },
    );
    console.log(`Assigning user: ${username} the token: ${token}`);
    res.cookie("authToken", token, {
      path: "/", // Cookie is accessible from all paths
      expires: new Date(Date.now() + 3600000 * 3), // Cookie expires in 3 hours
      secure: false, // Cookie will only be sent over HTTPS
      httpOnly: false, // Cookie cannot be accessed via client-side scripts
    });
  }

  /**
   * Revoke current auth token
   */
  static revokeAuthToken(res) {
    return res.clearCookie("authToken");
  }

  /**
   * Put this middleware in front of any GET requests for protected web pages
   * that you must be logged in to see
   */
  static checkAuthToken(req, res, next) {
    const token = req.cookies.authToken;

    console.log("Checking auth token");

    if (!token) {
      console.log("No token found, redirecting to login");
      req.loggedIn = false;
      return res.redirect("/login");
    }

    try {
      const decoded = jwt.verify(token, "super-secret");
      console.log("Checking auth: " + decoded);
      req.loggedIn = true;
      return next();
    } catch (error) {
      console.log("Error: Invalid token " + error);
      res.clearCookie("authToken");
      return res.redirect("/login");
    }
  }

  /**
   * Put this middleware in front of any GET requests for pages
   * that require user data
   */
  static async collectAuthTokenData(req, res, next) {
    const token = req.cookies.authToken;

    console.log("Checking auth token");

    if (!token) {
      console.log("No token found");
      req.loggedIn = false;
      req.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, "super-secret");
      console.log("Fetching user data for: " + decoded);
      req.loggedIn = true;
      req.user = await User.buildFromDB(decoded.username);
      return next();
    } catch (error) {
      console.error("Error in collectAuthTokenData: " + error);
      req.loggedIn = false;
      req.user = null;
      return next();
    }
  }
}
module.exports = LoginRegisterController;

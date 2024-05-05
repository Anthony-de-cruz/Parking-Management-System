const jwt = require("jsonwebtoken");

var User = require("../models/user");

var databaseManager = require("../controllers/databaseManager");
const { query } = databaseManager;

class LoginRegisterController {
  constructor() {}

  static registerUser(username, password) {}

  /**
   * Generate a new auth token and save it as a cookie
   */
  static generateAuthToken(res, username, isAdmin) {
    const token = jwt.sign(
      { username: username, isAdmin: isAdmin },
      "super-secret",
      {
        expiresIn: "1h",
      },
    );
    console.log(`Assigning user: ${username} the token: ${token}`);
    res.cookie("authToken", token, {
      path: "/", // Cookie is accessible from all paths
      expires: new Date(Date.now() + 3600000), // Cookie expires in 1 hour
      secure: false, // Cookie will only be sent over HTTPS
      httpOnly: false, // Cookie cannot be accessed via client-side scripts
    });
  }

  /**
   * Revoke current auth token
   */
  static revokeAuthToken(res) {
    return res.status(501).json({ error: "Not implemented" });
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
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" + error });
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
      next();
    }

    try {
      const decoded = jwt.verify(token, "super-secret");
      console.log("Fetching user data for: " + decoded);
      req.loggedIn = true;
      req.user = await User.buildFromDB(decoded.username);
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" + error });
    }
  }
}

module.exports = LoginRegisterController;

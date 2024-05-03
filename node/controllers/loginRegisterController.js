var databaseManager = require("../controllers/databaseManager");
const { query } = databaseManager;

const jwt = require("jsonwebtoken");

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
   * Put this middleware in front of any GET requests for protected web pages
   */
  static checkAuthToken(req, res, next) {
    const token = req.cookies.authToken;

    console.log("Checking auth token");

    if (!token) {
      return res.redirect("/login");
    }

    try {
      const decoded = jwt.verify(token, "super-secret");
      console.log(decoded);
      req.username = decoded.username;
      req.isAdmin = decoded.isAdmin;
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" + error });
    }
  }
}

module.exports = LoginRegisterController;

var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");
const AdminController = require("../controllers/adminController");

/* GET manage booking page. */
router.get(
  "/",
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  async function (req, res, next) {
    res.render("adminParkingRequests", {
      loggedIn: req.loggedIn,
      user: req.user,
    });
  },
);

module.exports = router;

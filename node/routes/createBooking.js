var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");

/* GET create booking page. */
router.get(
  "/",
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  async (req, res, next) => {
    res.render("createBooking", { loggedIn: req.loggedIn, user: req.user });
  },
);

module.exports = router;

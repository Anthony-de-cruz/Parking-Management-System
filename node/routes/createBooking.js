var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");
const UserController = require("../controllers/userController");

/* GET create booking page. */
router.get(
  "/",
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  async (req, res, next) => {
    res.render("createBooking", { loggedIn: req.loggedIn, user: req.user });
  },
);

router.post(
  "/",
  LoginRegisterController.collectAuthTokenData,
  UserController.createBooking,
);

module.exports = router;

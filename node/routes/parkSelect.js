var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");
const UserController = require("../controllers/userController");

/* GET create parking page. */
router.get(
  "/",
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  function (req, res, next) {
    res.render("parkSelect", {
      loggedIn: req.loggedIn,
      user: req.user,
    });
  },
);

router.post(
  "/",
  LoginRegisterController.collectAuthTokenData,
  UserController.selectBooking,
  function (req, res, next) {
    if (!req.errorMsg) {
      res.redirect("park-check?id=" + req.bookingID);
    }
    res.render("parkSelect", {
      loggedIn: req.loggedIn,
      user: req.user,
      errorMsg: req.errorMsg,
    });
  },
);

module.exports = router;

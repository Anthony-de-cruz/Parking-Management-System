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
    res.render("park", {
      loggedIn: req.loggedIn,
      user: req.user,
    });
  },
);

router.post(
  "/select-booking",
  LoginRegisterController.collectAuthTokenData,
  UserController.selectBooking,
  function (req, res, next) {
    res.render("park", {
      loggedIn: req.loggedIn,
      user: req.user,
      bookingSelected: req.bookingSelected,
      targetLatitude: req.targetLatitude,
      targetLongitude: req.targetLongitude,
      targetCarpark: req.targetCarpark,
      targetParkingSpace: req.targetParkingSpace,
      errorMsg: req.errorMsg,
    });
  },
);

router.post(
  "/park",
  LoginRegisterController.collectAuthTokenData,
  UserController.park,
  function (req, res, next) {
    res.render("park", {
      loggedIn: req.loggedIn,
      user: req.user,
      bookingSelected: true,
      targetLatitude: req.targetLatitude,
      targetLongitude: req.targetLongitude,
      targetCarpark: req.targetCarpark,
      targetParkingSpace: req.targetParkingSpace,
      parkSuccessMsg: req.parkSuccessMsg,
      errorMsg: req.errorMsg,
    });
  },
);

module.exports = router;

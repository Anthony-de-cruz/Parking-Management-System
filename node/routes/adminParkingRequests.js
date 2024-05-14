var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");
const AdminController = require("../controllers/adminController");

/* GET manage booking page. */
router.get(
  "/",
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  AdminController.getBookingRequests,
  async function (req, res, next) {
    res.render("adminParkingRequests", {
      loggedIn: req.loggedIn,
      user: req.user,
      bookingRequests: req.bookingRequests,
    });
  },
);

router.post(
  "/approve",
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  AdminController.approveBookingRequest,
);

router.post(
  "/deny",
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  AdminController.denyBookingRequest,
);

module.exports = router;

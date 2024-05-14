var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");
const AdminController = require("../controllers/adminController");

/* GET manage parking page. */
router.get(
  "/",
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  AdminController.getParkingBookings,
  async function (req, res, next) {
    res.render("adminManageParking", { loggedIn: req.loggedIn, user: req.user, bookings: req.bookings });
  }
);

router.post(
  "/remove",
  LoginRegisterController.checkAuthToken,
  AdminController.removeBooking
);

router.post(
  "/toggle-block",
  LoginRegisterController.checkAuthToken,
  AdminController.toggleBlock
);

router.post(
  "/reserve",
  LoginRegisterController.checkAuthToken,
  AdminController.reserve
);

module.exports = router;



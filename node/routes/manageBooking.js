var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");
const UserController = require("../controllers/userController");

/* GET manage booking page. */
router.get(
  "/",
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  UserController.showBooking,
  async function (req, res, next) {
    try {
      // Render the template with the fetched bookings
      res.render("manageBooking", {
        loggedIn: req.loggedIn,
        user: req.user,
        bookings: req.bookings,
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).send("Error fetching bookings");
    }
  },
);


router.post(
  "/",
  LoginRegisterController.collectAuthTokenData,
  UserController.updateBookingDetails,
  async (req, res, next) => {
    try {
      res.render("manage-booking", {
        loggedIn: req.loggedIn,
        user: req.user,
        calculatedBooking: req.calculatedBooking,
        newBooking: req.newBooking,
      });
    } catch (error) {
      console.error("Error updating booking details:", error);
      res.status(500).send("Error updating booking details");
    }
  }
);


module.exports = router;

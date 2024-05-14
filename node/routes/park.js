var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");

/* GET create parking page. */
router.get(
  "/",
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  function (req, res, next) {
    res.render("park", { loggedIn: req.loggedIn, user: req.user });
  },
);

router.post(
  "/",
  LoginRegisterController.collectAuthTokenData,
  //UserController.PARKFUNCTION,  INSERT userController PARK FUNCTION HERE
  async (req, res, next) => {
    res.render("park", {
      loggedIn: req.loggedIn,
      user: req.user,
      calculatedBooking: req.calculatedBooking,
      newBooking: req.newBooking,
    });
  },
);

module.exports = router;

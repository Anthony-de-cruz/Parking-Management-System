var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");
const AdminController = require("../controllers/adminController");

/* GET manage parking page. */
router.get(
  "/",
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  AdminController.getParkingSpaces,
  async function (req, res, next) {
    res.render("adminManageParking", { 
      loggedIn: req.loggedIn, 
      user: req.user, 
      parkingSpaces: req.parkingSpaces,
      errorMessage: req.query.errorMessage // To handle error message
    });
  }
);

router.post(
  "/add",
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  AdminController.addParkingSpace
);

router.post(
  "/remove",
  LoginRegisterController.checkAuthToken,
  AdminController.removeParkingSpace
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

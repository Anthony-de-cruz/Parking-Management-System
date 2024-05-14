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
  AdminController.addParkingSpace,
  AdminController.getParkingSpaces, // Fetch updated parking spaces
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
  "/remove",
  LoginRegisterController.checkAuthToken,
  AdminController.removeParkingSpace,
  AdminController.getParkingSpaces, // Fetch updated parking spaces
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
  "/toggle-block",
  LoginRegisterController.checkAuthToken,
  AdminController.toggleBlock,
  AdminController.getParkingSpaces, // Fetch updated parking spaces
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
  "/reserve",
  LoginRegisterController.checkAuthToken,
  AdminController.reserve,
  AdminController.getParkingSpaces, // Fetch updated parking spaces
  async function (req, res, next) {
    res.render("adminManageParking", {
      loggedIn: req.loggedIn,
      user: req.user,
      parkingSpaces: req.parkingSpaces,
      errorMessage: req.query.errorMessage // To handle error message
    });
  }
);

module.exports = router;

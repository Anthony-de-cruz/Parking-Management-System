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
      errorMessage: req.query.errorMessage, // To handle error message
      successMessage: req.query.successMessage // To handle success message
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
  AdminController.removeParkingSpace,
  async function (req, res) {
    res.redirect('/admin-manage-parking?successMessage=' + encodeURIComponent('Successfully removed parking space.'));
  }
);

router.post(
  "/toggle-block",
  LoginRegisterController.checkAuthToken,
  AdminController.toggleBlock,
  async function (req, res) {
    const successMessage = req.body.originalStatus === 'blocked' ? 'Successfully released parking space.' : 'Successfully blocked parking space.';
    res.redirect('/admin-manage-parking?successMessage=' + encodeURIComponent(successMessage));
  }
);

router.post(
  "/reserve",
  LoginRegisterController.checkAuthToken,
  AdminController.reserve,
  async function (req, res) {
    const successMessage = req.body.originalStatus === 'reserved' ? 'Successfully unreserved parking space.' : 'Successfully reserved parking space.';
    res.redirect('/admin-manage-parking?successMessage=' + encodeURIComponent(successMessage));
  }
);

module.exports = router;

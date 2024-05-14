var express = require('express');
var router = express.Router();

const LoginRegisterController = require('../controllers/loginRegisterController');
const AdminController = require('../controllers/adminController');

/* GET admin data view page. */
router.get(
  '/',
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  AdminController.getParkingSpaceStatus,
  function (req, res, next) {
    res.render('adminDataView', {
      loggedIn: req.loggedIn,
      user: req.user,
      status: req.parkingSpaceStatus
    });
  }
);

module.exports = router;

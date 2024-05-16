var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");
const AdminController = require("../controllers/adminController");

/* GET home page. */
router.get(
  "/",
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  AdminController.generateAlert,
  AdminController.getAdminAlerts,
  function (req, res, next) {
    res.render("adminAlert", {
      loggedIn: req.loggedIn,
      user: req.user,
      resultMsg: req.resultMsg,
    });
  },
);

module.exports = router;


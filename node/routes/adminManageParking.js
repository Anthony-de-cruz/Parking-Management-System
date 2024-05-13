var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");
const User = require("../models/user");



/* GET create booking page. */
router.get(
  "/",
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  async function (req, res, next) {
    res.render("adminManageParking", { loggedIn: req.loggedIn, user: req.user });
  },
);

router.post(
  "/update",
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  async function (req, res, next) {
    
      // Redirect back to the manageAccount page with a success message
      res.redirect('/admin-manage-parking?success=true');

  }
);


module.exports = router;



var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");
const User = require("../models/user");

/* GET create booking page. */
router.get(
  "/",
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  function (req, res, next) {
    res.render("manageAccount", { loggedIn: req.loggedIn, user: req.user });
  }
);

router.post(
  "/update",
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  async function (req, res, next) {
    const { changePass, changeEmail } = req.body;
    const username = req.user.username;
    try {
      // Update password
      if (changePass) {
        await User.updatePassword(username, changePass);
      }

      // Update email
      if (changeEmail) {
        await User.updateEmail(username, changeEmail);
      }

      // Redirect back to the manageAccount page with a success message
      res.redirect('/manage-account?success=true');
    } catch (error) {
      console.error("Failed to update account:", error);
      res.status(500).render('manageAccount', { loggedIn: req.loggedIn, user: req.user, error: "Failed to update account due to server error." });
    }
  }
);

module.exports = router;

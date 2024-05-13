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
    res.render("addBalance", { loggedIn: req.loggedIn, user: req.user });
  },
);

router.post(
  "/",
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  async function (req, res, next) {
    const amountToAdd = parseFloat(req.body.balance);
    if (isNaN(amountToAdd) || amountToAdd <= 0) {
      return res.status(400).render('addBalance', { loggedIn: req.loggedIn, user: req.user, error: "Please enter a valid positive amount to add." });
    }

    try {
      const newBalance = req.user.balance + Math.round(amountToAdd * 100);  // Convert to integer cents
      await User.updateBalance(req.user.username, newBalance);
      res.redirect('/add-balance?success=true');
    } catch (error) {
      console.error("Failed to update balance:", error);
      res.status(500).render('addBalance', { loggedIn: req.loggedIn, user: req.user, error: "Failed to update balance due to server error." });
    }
  }
);

module.exports = router;

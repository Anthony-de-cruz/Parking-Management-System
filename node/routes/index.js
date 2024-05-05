var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");

/* GET home page. */
router.get(
  "/",
  LoginRegisterController.collectAuthTokenData,
  function (req, res, next) {
    res.render("index", { loggedIn: req.loggedIn, user: req.user });
  },
);

module.exports = router;

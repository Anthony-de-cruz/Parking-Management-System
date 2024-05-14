var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");
const UserController = require("../controllers/userController");

/* GET create unparking page. */
router.get(
  "/",
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  function (req, res, next) {
    res.render("unpark", {
      loggedIn: req.loggedIn,
      user: req.user,
    });
  },
);

router.post(
  "/",
  LoginRegisterController.collectAuthTokenData,
  UserController.unpark,
  function (req, res, next) {
    res.render("unpark", {
      loggedIn: req.loggedIn,
      user: req.user,
      resultMsg: req.resultMsg,
    });
  },
);

module.exports = router;

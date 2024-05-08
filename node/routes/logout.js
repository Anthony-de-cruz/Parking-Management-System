var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");

/* GET create logout page. */
router.get(
  "/",
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  function (req, res, next) {
    res.render("logout", { loggedIn: req.loggedIn, user: req.user });
  },
);

router.post("/", function (req, res, next) {
  return res.clearCookie("authToken").redirect("/");
});

module.exports = router;

var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");
const UserController = require("../controllers/userController");

router.get(
    "/",
    LoginRegisterController.checkAuthToken,
    LoginRegisterController.collectAuthTokenData,
    async function (req, res, next) {
      res.render("adminManageParking", {
        loggedIn: req.loggedIn,
        user: req.user,
      });
    },
  );

module.exports = router;

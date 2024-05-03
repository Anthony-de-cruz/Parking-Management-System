var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");

/* GET create booking page. */
router.get(
  "/",
  LoginRegisterController.checkAuthToken,
  function (req, res, next) {
    res.render("addBalance", { title: "CarpPark" });
  },
);

module.exports = router;

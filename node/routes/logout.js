var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");

/* GET create logout page. */
router.get(
  "/",
  LoginRegisterController.checkAuthToken,
  function (req, res, next) {
    res.render("logout", { title: "CarpPark" });
  },
);

router.post("/", function (req, res, next) {
  return res.clearCookie("authToken").redirect("/");
});

module.exports = router;

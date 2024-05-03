var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");

/* GET create booking page. */
router.get(
  "/",
  LoginRegisterController.checkAuthToken,
  async (req, res, next) => {
    res.render("createBooking", {});
  },
);

module.exports = router;

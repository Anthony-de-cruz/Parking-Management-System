var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");

/* GET create logout page. */
router.get("/", function (req, res, next) {
  res.render("register", {});
});

router.post("/", function (req, res, next) {});

module.exports = router;

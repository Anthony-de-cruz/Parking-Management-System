var express = require("express");
var router = express.Router();

/* GET create booking page. */
router.get("/", function (req, res, next) {
  res.render("logout", { title: "CarpPark" });
});

module.exports = router;

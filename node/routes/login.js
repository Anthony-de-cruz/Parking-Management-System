var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");

const LoginRegisterController = require("../controllers/loginRegisterController");
const User = require("../models/user");

/* GET login. */
router.get("/", function (req, res, next) {
  res.render("login", {});
});

router.post("/", async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  console.log("Attempted login in as: " + username + "," + password);

  let user;
  try {
    user = await User.buildFromDB(username);
  } catch (exception) {
    console.error(exception);
    return res.render("login", { loginResult: "ERR: Username not found" });
  }

  if (user.isBanned === true) {
    console.log("ERR: user banned");
    return res.render("login", { loginResult: "ERR: User is banned" });
  }

  if (user.password === password) {
    LoginRegisterController.generateAuthToken(res, user.username, user.isAdmin);
    return res.redirect("/");
  }

  console.log("ERR: login not correct");
  return res.render("login", { loginResult: "ERR: Incorrect password" });
});

module.exports = router;

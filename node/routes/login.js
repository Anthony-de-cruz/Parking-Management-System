var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");

const LoginRegisterController = require("../controllers/loginRegisterController");
const User = require("../models/user");

/* GET login. */
router.get("/", function (req, res, next) {
  res.render("login", { loginResult: "" });
});

router.post("/", async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  console.log("Attempted login in as: " + username + "," + password);

  let queryResult = await LoginRegisterController.checkLogin(
    username,
    password,
  );

  console.log(queryResult);

  if (queryResult) {
    const user = User.buildFromDB(username);
    LoginRegisterController.generateAuthToken(res, user.username, user.isAdmin);
    return res.redirect("/");
  }

  console.log("ERR: login not correct");
  return res.render("login", { loginResult: "ERR: Incorrect Login" });
});

module.exports = router;

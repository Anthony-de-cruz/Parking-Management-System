var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");

/* GET create register page. */
router.get("/", function (req, res, next) {
  res.render("register", {});
});

router.post("/", async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email
  const phone_number = req.body.phone_number;

  console.log(
    "Attempted register as: " + username + "," + password + "," + email + "," + phone_number,
  );

  try {
    await LoginRegisterController.registerUser(username, password, email, phone_number);
    return res.redirect("/login");
  } catch (error) {
    // Not a particularly understandable error message
    console.log("ERR: Registration failed");
    return res.render("register", {
      registerResult: "ERR: Registration failed",
    });
  }
});

module.exports = router;

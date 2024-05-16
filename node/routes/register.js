var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");
const { sendEmail } = require("../controllers/emailService");

/* GET create register page. */
router.get("/", function (req, res, next) {
  res.render("register", {});
});

router.post("/", async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const phone_number = req.body.phone_number;

  console.log(
    "Attempted register as: " + username + "," + password + "," + email, + "," + phone_number,
  );

  try {
    await LoginRegisterController.registerUser(
      username,
      password,
      email,
      phone_number,
    );

    // Send the email notification
    const subject = "Account Created Successfully";
    const text = `Hello ${username},\n\nYour account has been created successfully. Here are your details:\n\nUsername: ${username}\nEmail: ${email}\n\nThank you for registering!\n\nBest regards,\nCarppark`;

    await sendEmail(email, subject, text);

    return res.redirect("/login");
  } catch (error) {
    // Not a particularly understandable error message
    console.log("ERR: Registration failed", error);
    return res.render("register", {
      registerResult: "ERR: Registration failed",
    });
  }
});

module.exports = router;

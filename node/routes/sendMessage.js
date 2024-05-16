var express = require("express");
var router = express.Router();
var loginRegisterController = require("../controllers/loginRegisterController");
var MessageController = require("../controllers/messageController");

router.get(
  "/", 
  loginRegisterController.checkAuthToken, 
  loginRegisterController.collectAuthTokenData, 
  function (req, res, next) {
    res.render("sendMessage", {
      loggedIn: req.loggedIn,
      user: req.user,
      message: req.query.message,
      messageType: req.query.messageType
    });
  }
);

router.post("/", loginRegisterController.checkAuthToken, loginRegisterController.collectAuthTokenData, async function (req, res, next) {
  const { message } = req.body;
  const user = req.user;

  try {
    await MessageController.sendMessageToAdmin(user, message);
    res.redirect('/send-message?message=Message sent!&messageType=success');
  } catch (error) {
    console.error(error);
    res.redirect('/send-message?message=Failed to send message.&messageType=error');
  }
});

module.exports = router;

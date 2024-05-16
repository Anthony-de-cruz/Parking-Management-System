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
        }
    );
});

router.post("/", loginRegisterController.checkAuthToken, loginRegisterController.collectAuthTokenData, async function (req, res, next) {
  const { message } = req.body;
  const user = req.user;

  try {
    await MessageController.sendMessageToAdmin(user, message);
    res.send('Message sent!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to send message.');
  }
});

module.exports = router;

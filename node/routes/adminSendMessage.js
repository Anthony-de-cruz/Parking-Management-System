var express = require("express");
var router = express.Router();
var loginRegisterController = require("../controllers/loginRegisterController");
var userController = require("../controllers/userController");
var MessageController = require("../controllers/messageController");

router.get(
  "/", 
  loginRegisterController.checkAuthToken, 
  loginRegisterController.collectAuthTokenData, 
  async function (req, res, next) {
    const users = await userController.getUsers();
    res.render("adminSendMessage", {
      loggedIn: req.loggedIn,
      user: req.user,
      users: users,
      message: req.query.message,
      messageType: req.query.messageType
    });
  }
);

router.post(
  "/", 
  loginRegisterController.checkAuthToken, 
  loginRegisterController.collectAuthTokenData, 
  async function (req, res, next) {
    const { username, message } = req.body;

    try {
      await MessageController.sendMessageToUser(username, message);
      res.redirect('/admin-send-message?message=Message sent!&messageType=success');
    } catch (error) {
      console.error(error);
      res.redirect('/admin-send-message?message=Failed to send message.&messageType=error');
    }
});

module.exports = router;

var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");
const User = require("../models/user");

/* GET create booking page. */
router.get(
  "/",
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  async function (req, res, next) {
    try {
      const users = await User.getUsers();
      res.render("adminManageUsers", { loggedIn: req.loggedIn, user: req.user, users: users });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      res.status(500).render('adminManageUsers', { loggedIn: req.loggedIn, user: req.user, error: "Failed to fetch users." });
    }
  },
);

router.post(
  "/update",
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  async function (req, res, next) {
    const { action, username} = req.body;
    const isAdmin = req.user.isAdmin; 

    try {

      if (!isAdmin) {
        throw new Error("Only admins can perform this action.");
      }

      if (action === "ban") {
        console.log("action ban works");
        await banUser(username);
        console.log("function ban works");
      //} else if (action === "unban") {
      //  await User.unbanUser(username, isAdmin);
      } else if (action === "delete") {
        console.log("action delete works");
        await deleteUser(username);
        console.log("function delete works");
      } else {
        throw new Error("Invalid action.");
      }

      // Redirect back to the manageAccount page with a success message
      res.redirect('/manage-users?success=true');
    } catch (error) {
      console.error("Failed to update account:", error);
      res.status(500).render('adminManageUsers', { loggedIn: req.loggedIn, user: req.user, error: "Failed to update account due to server error." });
    }
  }
);

async function deleteUser(button) {
  var username = button.dataset.username;
  await query("DELETE FROM app_user WHERE username = $1;", [username]);
  // Perform delete user action
}

async function banUser(button) {
  var username = button.dataset.username;
  // Perform ban user action
}


module.exports = router;



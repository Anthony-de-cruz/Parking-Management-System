var express = require("express");
var router = express.Router();

const LoginRegisterController = require("../controllers/loginRegisterController");
const AdminController = require("../controllers/adminController");

/* GET manage users page. */
router.get(
  "/",
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  async function (req, res, next) {
    try {
      const users = await AdminController.getUsers();
      res.render("adminManageUsers", { loggedIn: req.loggedIn, user: req.user, users: users });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      res.status(500).render('adminManageUsers', { loggedIn: req.loggedIn, user: req.user, error: "Failed to fetch users." });
    }
  }
);

router.post(
  "/update",
  LoginRegisterController.checkAuthToken,
  LoginRegisterController.collectAuthTokenData,
  async function (req, res, next) {
    const { action, username } = req.body;
    const isAdmin = req.user.isAdmin;

    try {
      if (!isAdmin) {
        throw new Error("Only admins can perform this action.");
      }

      if (action === "ban") {
        await AdminController.banUser(username);
      } else if (action === "unban") {
        await AdminController.unbanUser(username);
      } else if (action === "delete") {
        await AdminController.deleteUser(username);
      } else {
        throw new Error("Invalid action.");
      }

      res.redirect('/admin-manage-users');
    } catch (error) {
      console.error("Failed to update user:", error);
      res.status(500).render('adminManageUsers', { loggedIn: req.loggedIn, user: req.user, error: "Failed to update user due to server error." });
    }
  }
);



module.exports = router;



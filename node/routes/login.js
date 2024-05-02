var express = require("express");
var router = express.Router();

var databaseManager = require("../controllers/databaseManager");
const { query } = databaseManager;

/* GET login. */
router.get("/", function (req, res, next) {
  res.render("login", { loginResult: "" });
});

router.post("/", async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  console.log("Attempted login in as: " + username + "," + password);

  let queryResult = await checkLogin(username, password);
  console.log("" + queryResult);
  if (queryResult) {
    console.log("Loading result...");
    res.render("login", { loginResult: "Login successful!" });
  } else {
    console.log("ERR: login not correct");
    res.render("login", { loginResult: "ERR: Incorrect Login", error: true });
  }
});

async function checkLogin(username, password) {
  const params = [username];
  const result = await query(
    "SELECT password FROM app_user WHERE username = $1;",
    params,
  );
  if (result.rowCount != 0 && password === result.rows[0].password) {
    return true;
  }
  return false;
}

module.exports = router;

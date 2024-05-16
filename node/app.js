var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var favicon = require("serve-favicon");

var databaseManager = require("./controllers/databaseManager");
const { testDB } = databaseManager;

testDB();

var indexRouter = require("./routes/index");
var loginRouter = require("./routes/login");
var registerRouter = require("./routes/register");
var createBookingRouter = require("./routes/createBooking");
var logoutRouter = require("./routes/logout");
var addBalanceRouter = require("./routes/addBalance");
var manageBookingRouter = require("./routes/manageBooking");
var manageAccountRouter = require("./routes/manageAccount");
var parkRouter = require("./routes/park");
var unparkRouter = require("./routes/unpark");
var sendMessageRouter = require("./routes/sendMessage");
var adminDataViewRouter = require("./routes/adminDataView");
var adminManageParkingRouter = require("./routes/adminManageParking");
var adminManageUsersRouter = require("./routes/adminManageUsers");
var adminManageParkingRouter = require("./routes/adminManageParking");
var adminParkingRequestsRouter = require("./routes/adminParkingRequests");
var adminSendMessageRouter = require("./routes/adminSendMessage");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// routing
app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/create-booking", createBookingRouter);
app.use("/logout", logoutRouter);
app.use("/add-balance", addBalanceRouter);
app.use("/manage-booking", manageBookingRouter);
app.use("/manage-account", manageAccountRouter);
app.use("/park", parkRouter);
app.use("/unpark", unparkRouter);
app.use("/send-message", sendMessageRouter);
app.use("/admin-data-view", adminDataViewRouter);
app.use("/admin-manage-parking", adminManageParkingRouter);
app.use("/admin-manage-users", adminManageUsersRouter);
app.use("/admin-manage-parking", adminManageParkingRouter);
app.use("/admin-parking-requests", adminParkingRequestsRouter);
app.use("/admin-send-message", adminSendMessageRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

const express = require("express");
const app = express.Router();
const usercontroller = require("../Controllers/usercontroller");
const admincontroller = require("../Controllers/admincontroller");

app.route("/signup").post(usercontroller.signup);
app.route("/login").post(usercontroller.login);
app
  .route("/getbooks")
  .get(
    usercontroller.protect,
    usercontroller.CheckUser,
    usercontroller.getbooks
  );
app
  .route("getmybooks")
  .get(
    usercontroller.protect,
    usercontroller.CheckUser,
    usercontroller.getmybook
  );
module.exports = app;

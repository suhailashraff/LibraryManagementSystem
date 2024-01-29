const express = require("express");
const router = express.Router();
const admincontroller = require("../Controllers/admincontroller");
const usercontroller = require("../Controllers/usercontroller");

router
  .route("/addbook")
  .post(
    usercontroller.protect,
    admincontroller.CheckAdmin,
    admincontroller.addbook
  );

router
  .route("/updatebook")
  .patch(
    usercontroller.protect,
    admincontroller.CheckAdmin,
    admincontroller.updateBook
  );

router
  .route("/allotbook")
  .post(
    usercontroller.protect,
    admincontroller.CheckAdmin,
    admincontroller.allotBook
  );

module.exports = router;

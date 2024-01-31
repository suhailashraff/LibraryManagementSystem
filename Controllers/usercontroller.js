const express = require("express");
const app = express.Router();
const jwt = require("jsonwebtoken");

const secretkey = "thisismysecretkey";
const Book = require("../Modals/booksModal");
const Admin = require("../Modals/AdminModal");
const User = require("../Modals/userModal");

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

exports.signup = catchAsync(async (req, res, next) => {
  if (req.body.password != req.body.confirmPassword) {
    return res.status(401).json({
      status: "fail",
      message: "Password and confirmPassword does not match ",
    });
  }
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  return res.status(200).json({
    status: "success",
    message: "User Created",
    data: user,
  });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Please enter valid credentials, both Email and Password",
    });
  }

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.comparepassword(password, admin.password))) {
    const token = jwt.sign({ id: admin.id }, secretkey);
    return res.status(200).json({
      status: "success",
      message: "Logged in successfully as Admin",
      token,
    });
  }

  const user = await User.findOne({ email });
  if (user && (await user.comparepassword(password, user.password))) {
    const token = jwt.sign({ id: user.id }, secretkey);
    return res.status(200).json({
      status: "success",
      message: "Logged in successfully as User",
      token,
    });
  }

  return res.status(400).json({
    status: "Fail",
    message: "Invalid Email or Password",
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  const data = req.header("Authorization");
  if (!data) {
    return res.status(401).json({
      message: "Please Login Again",
    });
  }
  const token = data.replace("Bearer ", "").split(" ").join("");

  if (!token) {
    return res.send("No token Found ");
  }

  const decode = await jwt.verify(token, secretkey, (err, data) => {
    if (err) {
      return false;
    }
    return data;
  });
  if (!decode) {
    return res.status(401).json({
      status: " fail",
      message: "Session expired",
    });
  }
  const admin = await Admin.findOne({ _id: decode.id });
  const user = await User.findOne({ _id: decode.id });
  if (admin) {
    req.user = admin;
    next();
  } else if (user) {
    req.user = user;
    next();
  } else if (!user && !admin) {
    return res.status(400).json({
      status: "fail",
      message: "You are not a Valid User/Admin, Please register first ",
    });
  }
});

exports.CheckUser = catchAsync(async (req, res, next) => {
  try {
    if (req.user.roles === "user") {
      next();
    } else {
      return res.status(401).json({
        status: "fail",
        message: "You are authorized to use this Route",
      });
    }
  } catch (err) {
    return res.status(400).json({
      status: "Fail",
      Error: err.message,
    });
  }
});

exports.adminMiddleware = catchAsync(async (req, res, next) => {
  if (req.user.role !== "user") {
    return next();
  }
});

exports.getbooks = catchAsync(async (req, res) => {
  try {
    const book = await Book.find();

    return res.status(200).json({
      status: "success",
      message: "Here are all the book in the library",
      books: book,
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      error: err.message,
    });
  }
});

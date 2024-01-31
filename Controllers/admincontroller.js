const Admin = require("../Modals/AdminModal");
const jwt = require("jsonwebtoken");
const Book = require("../Modals/booksModal");
const User = require("../Modals/userModal");
const Data = require("../Modals/DataModal");
const currentTime = require("moment");
const { default: mongoose } = require("mongoose");
const {
  AppError,
  errorHandler,
  catchAsync,
} = require("../ErrrorHandlers/AppError");

exports.seedAdminMiddleware = catchAsync(async (req, res, next) => {
  const adminExists = await Admin.findOne({ roles: "admin" });

  if (!adminExists) {
    const admin = await Admin.create({
      name: "suhail ashraf",
      email: "suhail@gmail.com",
      password: "123456",
      confirmPassword: "123456",
    });

    console.log("Admin seeded successfully:", admin);
  } else {
    console.log("Admin already exists");
  }
});

exports.addbook = catchAsync(async (req, res, next) => {
  const bookInLibrary = await Book.findOne({ Bookname: req.body.Bookname });
  if (!bookInLibrary) {
    const book = await Book.create({
      Bookname: req.body.Bookname,
      Author: req.body.Author,
      Genre: req.body.Genre,
      AvailableCopies: req.body.Copies,
    });
    return res.status(201).json({
      status: "Success",
      message: "The book has been added successfully",
      Data: book,
    });
  } else {
    return next(new AppError("This book is already in our database", 409));
  }
});

exports.CheckAdmin = catchAsync(async (req, res, next) => {
  if (req.user.roles === "admin") {
    next();
  } else {
    return next(
      new AppError("You are not Authorized to access this route", 409)
    );
  }
});

exports.updateBook = catchAsync(async (req, res) => {
  const book = await User.findOne(booksalloted.req.body.Bookname);
  console.log(book);
});

exports.allotBook = catchAsync(async (req, res, next) => {
  const { email, Bookname } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("User does not exist.", 404));
  }

  const book = await Book.findOne({ Bookname });

  if (!book) {
    return next(new AppError("book not found", 400));
  }
  const bookId = new mongoose.Types.ObjectId(book._id);
  console.log(bookId);
  const entry = await Data.updateOne({
    email: user.email,

    Date_of_Issue: Date.now(),
  });

  return res.status(201).json({
    status: "Success",
    message: "Entry successful",
    data: entry,
  });
});

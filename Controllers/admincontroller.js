const Admin = require("../Modals/AdminModal");
const jwt = require("jsonwebtoken");
const Book = require("../Modals/booksModal");
const User = require("../Modals/userModal");
const Data = require("../Modals/DataModal");
const currentTime = require("moment");
const { default: mongoose } = require("mongoose");

exports.seedAdminMiddleware = async (req, res) => {
  try {
    console.log("Admin Middleware is running");
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
  } catch (err) {
    console.error("Error seeding admin:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addbook = async (req, res) => {
  try {
    const bookInLibrary = await Book.findOne({ Bookname: req.body.Bookname });
    if (bookInLibrary) {
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
      return res.status(401).json({
        status: "Fail",
        message: "This book is already in our database",
      });
    }
  } catch (err) {
    return res.status(400).json({
      status: "Fail",
      Error: err.message,
    });
  }
};
exports.CheckAdmin = async (req, res, next) => {
  try {
    if (req.user.roles === "admin") {
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
};

exports.updateBook = async (req, res) => {
  try {
    const book = await User.findOne(booksalloted.req.body.Bookname);
    console.log(book);
  } catch (err) {
    return res.status(400).json({
      Status: "error",
      Error: err.message,
    });
  }
};

exports.allotBook = async (req, res) => {
  try {
    const { email, Bookname } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "Fail",
        message: "User not found",
      });
    }

    const book = await Book.findOne({ Bookname });

    if (!book) {
      return res.status(404).json({
        status: "Fail",
        message: "Book not found",
      });
    }
    const bookId = new mongoose.Types.ObjectId(book._id);
    console.log(bookId);
    const entry = await Data.updateOne({
      email: user.email,
      $push: { BooksAlloted: { $each: bookId } },
      Date_of_Issue: Date.now(),
    });

    return res.status(201).json({
      status: "Success",
      message: "Entry successful",
      data: entry,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: "Fail",
      message: "An error occurred while processing your request",
      error: err.message,
    });
  }
};

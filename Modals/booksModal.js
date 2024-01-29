const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  Bookname: {
    type: String,
    required: [true, "Please enter book name"],
  },
  Author: {
    type: String,
    required: [true, "Book must have an Author"],
  },

  Genre: {
    type: String,
    required: [true, "Please enter genre of the book"],
  },
  AvailableCopies: {
    type: Number,
    required: [
      true,
      "Please tell us how many copies you want to add in this library",
    ],
  },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;

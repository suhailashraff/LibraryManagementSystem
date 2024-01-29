const mongoose = require("mongoose");
const Book = require("../Modals/booksModal");

const DataSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  BooksAlloted: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Book",
    },
  ],
  Date_of_Issue: {
    type: Date,
    default: Date.now(),
  },
});

const Data = mongoose.model("Data", DataSchema);

module.exports = Data;

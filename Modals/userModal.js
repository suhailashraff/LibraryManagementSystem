const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Book = require("./booksModal");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    // min: 2,
    // max: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, "please confirm your password"],
  },
  roles: {
    type: String,
    default: "user",
    enum: ["user"],
  },
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});

userSchema.methods.comparepassword = async (givenpassword, actualpassword) => {
  return await bcrypt.compare(givenpassword, actualpassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;

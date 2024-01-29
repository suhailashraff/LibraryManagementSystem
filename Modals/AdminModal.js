const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  roles: {
    type: String,
    default: "admin",
    enum: ["admin"],
  },
});

adminSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});

adminSchema.methods.comparepassword = async (givenpassword, actualpassword) => {
  return await bcrypt.compare(givenpassword, actualpassword);
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;

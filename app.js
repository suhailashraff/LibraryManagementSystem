const dotenv = require("dotenv");
const path = require("path");
const { AppError, errorHandler } = require("./ErrrorHandlers/AppError");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./Routes/userRoutes");
const seedAdminMiddleware = require("./Controllers/admincontroller");
const admincontroller = require("./Controllers/admincontroller");
const adminRoutes = require("./Routes/adminRoutes");
const undefinedRoutes = require("./Middlewares/ErrorHandlingMiddleware");
const secretkey = "thisismysecretkey";
const expires = 90;

const app = express();
const port = 8000;
admincontroller.seedAdminMiddleware();
app.use(express.json());

app.set("view engine", "pug");

app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "static")));

console.log(path.join(__dirname, "static"));
const rootDirectory = path.resolve(__dirname);

console.log("Root Directory:", rootDirectory);
mongoose
  .connect(
    "mongodb+srv://suhailashraf:suhail@cluster0.eseq5cy.mongodb.net/Library-System?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });

app.get("/homepage", (req, res) => {
  res.status(200).render("index");
});
app.use("/", userRoutes, adminRoutes);
app.use(errorHandler);

app.use(undefinedRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;

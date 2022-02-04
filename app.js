require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const cors = require("cors");

let app = express();
const userRoutes = require("./routes/user");
app.use(express.json());
app.use(cors());
app.use("/user", userRoutes);
app.get("/test", (req, res, next) => {
  console.log("endpoint working");
  res.json({ message: "hooray! welcome to our api!" });
});

module.exports = app;

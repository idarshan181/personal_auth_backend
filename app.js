require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/user");

let app = express();

app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);

app.get("/test", (req, res, next) => {
  console.log("endpoint working");
  res.json({ message: "hooray! welcome to our api!" });
});

module.exports = app;

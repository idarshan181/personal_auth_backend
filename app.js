require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const cors = require("cors");

let app = express();

app.use(express.json());
app.use(cors());

app.get("/test", (req, res, next) => {
  console.log("endpoint working");
  res.json({ message: "hooray! welcome to our api!" });
});

module.exports = app;

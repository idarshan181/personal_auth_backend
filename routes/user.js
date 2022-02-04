const express = require("express");
let router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
router.post("/add", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    username,
    password,
    mobile,
    DOB,
    socialAccounts,
    imageURL,
    city,
    country,
    resetToken,
  } = req.body;

  if (!(firstName && lastName && email && username && password && mobile)) {
    return res.status(400).json({
      status: false,
      error:
        "Invalid parameters provided, please provide firstName, lastName, email, username, password, mobile",
    });
  }
  try {
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(409).json({
        status: false,
        error: "User already exists, try different email address.",
      });
    }
    let encryptedPass = await bcrypt.hash(password, 10);
    let newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email.toLowerCase(),
      username: username,
      password: encryptedPass,
      mobile: mobile,
      DOB: DOB,
      socialAccounts: socialAccounts,
      imageURL: imageURL,
      city: city,
      country: country,
      resetToken: resetToken,
    });
    if (!newUser) {
      return res.status(500).json({
        status: false,
        error: "User not created, please try again.",
      });
    }
    return res.status(201).json({
      status: true,
      message: "User created successfully.",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to create user, please try again.",
      error: error,
    });
  }
});

module.exports = router;

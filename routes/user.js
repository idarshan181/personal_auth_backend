const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { check, validationResult, oneOf } = require("express-validator");
const jwt = require("jsonwebtoken");

let router = express.Router();
router.post(
  "/add",
  [
    check("firstName", "First Name is required").not().isEmpty(),
    check("lastName", "Last Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("username", "Please include a valid username").not().isEmpty(),
    check("mobile")
      .not()
      .isEmpty()
      .withMessage("Mobile number is required")
      .isLength({
        min: 10,
        max: 13,
      })
      .withMessage("must be at least 10 chars long and max 13 chars long"),
    check("password")
      .isLength({
        min: 8,
      })
      .withMessage("must be at least 8 chars long")
      .not()
      .isEmpty()
      .withMessage("Password is required"),
  ],
  async (req, res) => {
    // destructure the req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
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
    } = req.body;

    /* if (!(firstName && lastName && email && username && password && mobile)) {
      return res.status(400).json({
        status: false,
        error:
          "Invalid parameters provided, please provide firstName, lastName, email, username, password, mobile",
      });
    } */

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
        resetToken: "",
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
  }
);

router.post(
  "/login",
  [
    oneOf(
      [
        check("email", "Please include a valid email").isEmail(),
        check("username", "Please include a valid username").not().isEmpty(),
      ],
      "Please include a valid email or username"
    ),
    check("password")
      .isLength({
        min: 8,
      })
      .withMessage("must be at least 8 chars long")
      .not()
      .isEmpty()
      .withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }
    try {
      let { email, username, password } = req.body;
      console.log(req.body);
      if (email) {
        email = email.toLowerCase();
      }
      let user = await User.findOne({
        $or: [{ email: email }, { username: username }],
      });
      if (!user) {
        return res.status(404).json({
          status: false,
          error: "User not found, please try again.",
        });
      }
      let isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          status: false,
          error: "Invalid password, please try again.",
        });
      }
      let token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );
      return res.status(200).json({
        status: true,
        token: token,
        user: {
          email: user.email,
          id: user._id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          mobile: user.mobile,
          DOB: user.DOB,
          socialAccounts: user.socialAccounts,
          imageURL: user.imageURL,
          city: user.city,
          country: user.country,
        },
        message: "User logged in successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        error: error,
      });
    }
  }
);

module.exports = router;

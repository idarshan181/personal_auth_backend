const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  DOB: { type: Date },
  socialAccounts: {
    instagram: { type: String },
    facebook: { type: String },
    twitter: { type: String },
  },
  imageURL: { type: String },
  city: { type: String },
  country: { type: String },
  resetToken: { type: String },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  city: String,
  state: String,
  zipCode: String,
  highSchool: String,
  district: String,
  organization: String,
  university: String,
  major: String,
  interests: [String],
  collegeType: [String],
  profilePicture: String,
});

module.exports = mongoose.model("User", userSchema);

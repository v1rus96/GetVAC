const mongoose = require('mongoose');
const Vaccination = require("../models/Vaccination");
const HealthCenter = require("../models/HealthCenter");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  staffID: {
    type: String,
    required: true
  },
  healthCenter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: HealthCenter
  },
  passportNum: {
    type: String,
    default: "none"
  },
  vaccinations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: Vaccination
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

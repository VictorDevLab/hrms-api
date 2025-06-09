const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  personal: {
    type: Object,
  },
  employment: {
    type: Object,
  },
  hr: {
    type: Object,
  },
  compensation: {
    type: Object,
  },
  refreshToken: {
    type: String
  },
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);
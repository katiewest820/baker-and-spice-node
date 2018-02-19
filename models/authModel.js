const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''},
  userName: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('user', userSchema);
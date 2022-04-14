const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: String,
    imageUrl: String,
    email: String,
    subExpirationDate: String,
    password: {
      type: String,
      minglength: 5
    },
  }
);

const User = mongoose.model('user', userSchema);

module.exports = User;
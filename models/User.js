const mongoose = require('mongoose');

// Define a schema for user registration
const userSchema = new mongoose.Schema({
  username: { type: String, required: true},
  email: { type: String, required: true ,unique:true},
  password: { type: String, required: true},
});

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

module.exports = User;


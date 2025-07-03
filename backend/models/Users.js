const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  sorename: String,
  teacher: String,
  class: String,
  time: String,
  group: String,
  email: String,
  avatar: String // ✅ avatar URL shu yerga saqlanadi
});

module.exports = mongoose.model('User', userSchema);

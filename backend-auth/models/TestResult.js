const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestResult', testResultSchema);

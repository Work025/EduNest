const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  questions: [String], // savollar yoki ID’lar
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Test', TestSchema);

const express = require('express');
const router = express.Router();
const TestResult = require('../models/TestResult');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Save test result
router.post('/test-result', protect, async (req, res) => {
  try {
    const result = await TestResult.create({
      user: req.user.id,
      score: req.body.score
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Xatolik test saqlashda' });
  }
});

// Get my results
router.get('/test-result', protect, async (req, res) => {
  try {
    const results = await TestResult.find({ user: req.user.id });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Xatolik' });
  }
});

// Admin: get all results
router.get('/admin/results', protect, isAdmin, async (req, res) => {
  try {
    const results = await TestResult.find().populate('user', 'username');
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Xatolik' });
  }
});

module.exports = router;

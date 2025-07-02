const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const verifyToken = require('../middleware/auth'); // JWT tekshiruvi
const isAdmin = require('../middleware/isAdmin');

// 🔐 GET /api/tests/all  → faqat admin ko‘radi
router.get('/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const allTests = await Test.find().populate('userId', 'email'); // user emailini olib kelish
    res.json(allTests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 🔐 Saqlash: POST /api/tests
router.post('/', verifyToken, async (req, res) => {
  try {
    const { score, questions } = req.body;

    const test = new Test({
      userId: req.user.id,  // JWT orqali user aniqlanadi
      score,
      questions
    });

    await test.save();
    res.status(201).json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔐 Faqat login bo‘lgan user testlarini ko‘rish: GET /api/tests
router.get('/', verifyToken, async (req, res) => {
  try {
    const tests = await Test.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

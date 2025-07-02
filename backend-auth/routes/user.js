const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ PUT /api/users/avatar/:id — avatarni yangilash
router.put('/avatar/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { avatar: req.body.avatar },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

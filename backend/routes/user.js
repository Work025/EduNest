// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/Users');

router.put('/avatar/:id', async (req, res) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { avatar },
      { new: true }
    );

    // socket.io orqali avatarni barcha brauzerlarga jonatamiz
    req.app.get('io').emit('avatar_updated', {
      userId: user._id.toString(),
      avatarUrl: user.avatar,
    });

    res.json({ message: 'Avatar updated', imageUrl: user.avatar });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;

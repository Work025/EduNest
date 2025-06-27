const router = require('express').Router();

router.post('/register', async (req, res) => {
  res.json({ message: "Foydalanuvchi yaratildi" });
});

module.exports = router;

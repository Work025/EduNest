// routes/upload.js
const express = require('express');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/avatar', upload.single('avatar'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'avatars'
    });

    fs.unlinkSync(req.file.path); // Local faylni o‘chiradi

    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: 'Rasm yuklashda xatolik' });
  }
});

module.exports = router;

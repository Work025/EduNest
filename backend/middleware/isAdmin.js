const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Ruxsat yo‘q. Faqat admin' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Xatolik' });
  }
};

module.exports = isAdmin;

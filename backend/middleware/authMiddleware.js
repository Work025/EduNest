const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Token yo‘q' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token noto‘g‘ri' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.isAdmin) next();
  else res.status(403).json({ message: 'Faqat admin uchun' });
};

module.exports = { protect, isAdmin };

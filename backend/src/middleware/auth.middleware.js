const jwt = require('jsonwebtoken');
const SECRET_KEY = 'my_secret_key_for_class';

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Vui lòng đăng nhập!' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token không hợp lệ!' });
  }
};

const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Không có quyền truy cập!' });
  }
  next();
};

module.exports = { protect, authorize, SECRET_KEY };
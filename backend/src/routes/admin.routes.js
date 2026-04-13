const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register); // Đường dẫn Đăng ký
router.post('/login', authController.login);       // Đường dẫn Đăng nhập

module.exports = router;
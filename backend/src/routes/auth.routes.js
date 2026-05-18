const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Khi gọi POST /api/auth/register -> Chạy hàm register trong controller
router.post('/register', authController.register);

// Khi gọi POST /api/auth/login -> Chạy hàm login trong controller
router.post('/login', authController.login);

module.exports = router;
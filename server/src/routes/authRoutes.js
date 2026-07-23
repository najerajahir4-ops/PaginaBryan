const express = require('express');
const router = express.Router();
const { login, verifyToken, logout } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

// Límite de intentos de login: Máximo 5 cada 15 minutos
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,
  message: { error: 'Demasiados intentos de inicio de sesión. Por favor, intente de nuevo después de 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, login);
router.get('/verify', authMiddleware, verifyToken);
router.post('/logout', logout);

module.exports = router;

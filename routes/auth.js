// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Registrar usuario
router.post('/registro', authController.registrarUsuario);

// Login usuario
router.post('/login', authController.loginUsuario);

module.exports = router;
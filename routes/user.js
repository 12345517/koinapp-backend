const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { autenticar } = require('../middleware/auth');

router.get('/perfil', autenticar, userController.verPerfil);
router.post('/retirar', autenticar, userController.solicitarRetiro);

module.exports = router;
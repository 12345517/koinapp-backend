const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { esAdmin } = require('../middleware/admin');

router.get('/retiros-pendientes', esAdmin, adminController.obtenerRetirosPendientes);
router.put('/aprobar-retiro/:id', esAdmin, adminController.aprobarRetiro);
router.get('/usuarios', esAdmin, adminController.obtenerTodosUsuarios);

module.exports = router;
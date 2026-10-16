const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pago.controller');

//Ruta para consultar todos los pagos
router.get('/', pagoController.obtenerPagos);

//Ruta para consultar un pago mediante su ID
router.get('/:id', pagoController.obtenerPagoPorId);

module.exports = router;

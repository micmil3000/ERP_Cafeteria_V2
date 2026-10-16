const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/venta.controller');

//Ruta para obtener todas las ventas
router.get('/', ventaController.obtenerVentas);

//Ruta para obtener una venta mediante su ID
router.get('/:id', ventaController.obtenerVentaPorId);

//Ruta para registrar una nueva venta
router.post('/', ventaController.registrarVenta);

module.exports = router;

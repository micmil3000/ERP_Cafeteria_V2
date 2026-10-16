const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/factura.controller');

//Ruta para consultar la factura de una venta
router.get('/venta/:ventaId', facturaController.obtenerPorVenta);

//Ruta para registrar una factura
router.post('/', facturaController.registrar);

module.exports = router;

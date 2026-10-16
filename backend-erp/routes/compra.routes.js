const express = require('express');
const router = express.Router();
const compraController = require('../controllers/compra.controller');

//Ruta para obtener todas las compras
router.get('/', compraController.obtenerCompras);

//Ruta para obtener una compra mediante su ID
router.get('/:id', compraController.obtenerCompraPorId);

//Ruta para registrar una nueva compra
router.post('/', compraController.registrarCompra);

module.exports = router;

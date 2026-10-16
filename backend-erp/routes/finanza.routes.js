const express = require('express');
const router = express.Router();
const finanzaController = require('../controllers/finanza.controller');

//Ruta para obtener los movimientos financieros
router.get('/', finanzaController.obtenerMovimientos);

//Ruta para obtener el resumen financiero
router.get('/resumen', finanzaController.obtenerResumen);

//Ruta para obtener los gastos por categoría
router.get('/gastos-categoria', finanzaController.obtenerGastosPorCategoria);

//Ruta para obtener un movimiento mediante su ID
router.get('/:id', finanzaController.obtenerMovimientoPorId);

//Ruta para registrar un gasto manual
router.post('/', finanzaController.registrarGasto);

module.exports = router;

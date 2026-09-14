const express = require('express');
const router = express.Router();
const finanzaService = require('../services/finanza.service');

//Ruta para obtener los movimientos financieros
router.get('/', (req, res) => {

    finanzaService.obtenerMovimientos(req.query, (error, movimientos) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar movimientos' });
        res.json(movimientos);
    });

});

//Ruta para obtener el resumen financiero
router.get('/resumen', (req, res) => {

    finanzaService.obtenerResumen(req.query, (error, resumen) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar resumen' });
        res.json(resumen);
    });

});

//Ruta para obtener los gastos por categoría
router.get('/gastos-categoria', (req, res) => {

    finanzaService.obtenerGastosPorCategoria(req.query, (error, gastos) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar gráfica' });
        res.json(gastos);
    });

});

//Ruta para obtener un movimiento mediante su ID
router.get('/:id', (req, res) => {

    finanzaService.obtenerMovimientoPorId(req.params.id, (error, movimiento) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar movimiento' });
        if(!movimiento) return res.status(404).json({ mensaje: 'Movimiento no encontrado' });
        res.json(movimiento);
    });

});

//Ruta para registrar un gasto manual
router.post('/', (req, res) => {

    const gasto = req.body;

    if(!gasto.usuarioId || !gasto.fechaHora || !gasto.concepto || !gasto.categoria || !(Number(gasto.subtotal) > 0)) {
        return res.status(400).json({ mensaje: 'Datos de gasto inválidos' });
    }

    finanzaService.registrarGasto(gasto, (error, resultado) => {
        if(error) return res.status(500).json({ mensaje: 'Error al registrar gasto' });
        res.status(201).json({ mensaje: 'Gasto registrado', id: resultado.id });
    });

});

module.exports = router;

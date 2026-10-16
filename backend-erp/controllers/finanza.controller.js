const finanzaService = require('../services/finanza.service');

function obtenerMovimientos(req, res) {

    finanzaService.obtenerMovimientos(req.query, (error, movimientos) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar movimientos' });
        res.json(movimientos);
    });

}

function obtenerResumen(req, res) {

    finanzaService.obtenerResumen(req.query, (error, resumen) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar resumen' });
        res.json(resumen);
    });

}

function obtenerGastosPorCategoria(req, res) {

    finanzaService.obtenerGastosPorCategoria(req.query, (error, gastos) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar gráfica' });
        res.json(gastos);
    });

}

function obtenerMovimientoPorId(req, res) {

    finanzaService.obtenerMovimientoPorId(req.params.id, (error, movimiento) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar movimiento' });
        if(!movimiento) return res.status(404).json({ mensaje: 'Movimiento no encontrado' });
        res.json(movimiento);
    });

}

function registrarGasto(req, res) {

    const gasto = req.body;

    if(!gasto.usuarioId || !gasto.fechaHora || !gasto.concepto || !gasto.categoria || !(Number(gasto.subtotal) > 0)) {
        return res.status(400).json({ mensaje: 'Datos de gasto inválidos' });
    }

    finanzaService.registrarGasto(gasto, (error, resultado) => {
        if(error) return res.status(500).json({ mensaje: 'Error al registrar gasto' });
        res.status(201).json({ mensaje: 'Gasto registrado', id: resultado.id });
    });

}

module.exports = {
    obtenerMovimientos,
    obtenerResumen,
    obtenerGastosPorCategoria,
    obtenerMovimientoPorId,
    registrarGasto
};

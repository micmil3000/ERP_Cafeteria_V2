const pagoService = require('../services/pago.service');

function obtenerPagos(req, res) {

    pagoService.obtenerPagos((error, pagos) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar pagos' });
        res.json(pagos);
    });

}

function obtenerPagoPorId(req, res) {

    pagoService.obtenerPagoPorId(req.params.id, (error, pago) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar pago' });
        if(!pago) return res.status(404).json({ mensaje: 'Pago no encontrado' });
        res.json(pago);
    });

}

module.exports = {
    obtenerPagos,
    obtenerPagoPorId
};

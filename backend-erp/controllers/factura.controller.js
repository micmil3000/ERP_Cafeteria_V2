const facturaService = require('../services/factura.service');

function obtenerPorVenta(req, res) {

    facturaService.obtenerPorVenta(req.params.ventaId, (error, factura) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar factura' });
        if(!factura) return res.status(404).json({ mensaje: 'Factura no encontrada' });
        res.json(factura);
    });

}

function registrar(req, res) {

    facturaService.registrar(req.body.ventaId, req.body, (error, resultado) => {
        if(error) return res.status(500).json({ mensaje: 'Error al generar factura' });
        res.status(201).json({ mensaje: 'Factura generada', id: resultado.id, folio: resultado.folio });
    });

}

module.exports = {
    obtenerPorVenta,
    registrar
};

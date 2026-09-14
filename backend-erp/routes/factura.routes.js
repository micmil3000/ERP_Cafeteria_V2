const express = require('express');
const router = express.Router();
const facturaService = require('../services/factura.service');

//Ruta para consultar la factura de una venta
router.get('/venta/:ventaId', (req, res) => {

    facturaService.obtenerPorVenta(req.params.ventaId, (error, factura) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar factura' });
        if(!factura) return res.status(404).json({ mensaje: 'Factura no encontrada' });
        res.json(factura);
    });

});

//Ruta para registrar una factura
router.post('/', (req, res) => {

    facturaService.registrar(req.body.ventaId, req.body, (error, resultado) => {
        if(error) return res.status(500).json({ mensaje: 'Error al generar factura' });
        res.status(201).json({ mensaje: 'Factura generada', id: resultado.id, folio: resultado.folio });
    });

});

module.exports = router;

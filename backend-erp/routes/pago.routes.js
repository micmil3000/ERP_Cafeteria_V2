const express = require('express');
const router = express.Router();
const pagoService = require('../services/pago.service');

//Ruta para consultar todos los pagos
router.get('/', (req, res) => {

    pagoService.obtenerPagos((error, pagos) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar pagos' });
        res.json(pagos);
    });

});

//Ruta para consultar un pago mediante su ID
router.get('/:id', (req, res) => {

    pagoService.obtenerPagoPorId(req.params.id, (error, pago) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar pago' });
        if(!pago) return res.status(404).json({ mensaje: 'Pago no encontrado' });
        res.json(pago);
    });

});

module.exports = router;

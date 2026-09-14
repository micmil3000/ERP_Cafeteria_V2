const express = require('express');
const router = express.Router();
const ventaService = require('../services/venta.service');

//Ruta para obtener todas las ventas
router.get('/', (req, res) => {

    ventaService.obtenerVentas((error, ventas) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar ventas' });
        res.json(ventas);
    });

});

//Ruta para obtener una venta mediante su ID
router.get('/:id', (req, res) => {

    ventaService.obtenerVentaPorId(req.params.id, (error, venta) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar venta' });
        if(!venta) return res.status(404).json({ mensaje: 'Venta no encontrada' });
        res.json(venta);
    });

});

//Ruta para registrar una nueva venta
router.post('/', (req, res) => {

    ventaService.registrarVenta(req.body, (error, resultado) => {
        if(error) return res.status(400).json({ mensaje: error.message });
        res.status(201).json({ mensaje: 'Venta registrada', id: resultado.id, numeroVenta: resultado.numeroVenta });
    });

});

module.exports = router;

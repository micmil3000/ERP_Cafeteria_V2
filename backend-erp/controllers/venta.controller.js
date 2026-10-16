const ventaService = require('../services/venta.service');

function obtenerVentas(req, res) {

    ventaService.obtenerVentas((error, ventas) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar ventas' });
        res.json(ventas);
    });

}

function obtenerVentaPorId(req, res) {

    ventaService.obtenerVentaPorId(req.params.id, (error, venta) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar venta' });
        if(!venta) return res.status(404).json({ mensaje: 'Venta no encontrada' });
        res.json(venta);
    });

}

function registrarVenta(req, res) {

    ventaService.registrarVenta(req.body, (error, resultado) => {
        if(error) return res.status(400).json({ mensaje: error.message });
        res.status(201).json({ mensaje: 'Venta registrada', id: resultado.id, numeroVenta: resultado.numeroVenta });
    });

}

module.exports = {
    obtenerVentas,
    obtenerVentaPorId,
    registrarVenta
};

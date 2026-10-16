const compraService = require('../services/compra.service');

function obtenerCompras(req, res) {

    compraService.obtenerCompras((error, compras) => {

        if(error) {
            return res.status(500).json({ mensaje: 'Error al consultar compras' });
        }

        res.json(compras);

    });

}

function obtenerCompraPorId(req, res) {

    compraService.obtenerCompraPorId(req.params.id, (error, compra) => {

        if(error) {
            return res.status(500).json({ mensaje: 'Error al consultar compra' });
        }

        if(!compra) {
            return res.status(404).json({ mensaje: 'Compra no encontrada' });
        }

        res.json(compra);

    });

}

function registrarCompra(req, res) {

    compraService.registrarCompra(req.body, (error, resultado) => {

        if(error) {
            return res.status(400).json({ mensaje: error.message });
        }

        res.status(201).json({ mensaje: 'Compra registrada', id: resultado.id });

    });

}

module.exports = {
    obtenerCompras,
    obtenerCompraPorId,
    registrarCompra
};

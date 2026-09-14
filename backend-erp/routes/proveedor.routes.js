const express = require('express');
const router = express.Router();
const proveedorService = require('../services/proveedor.service');

//Ruta para obtener todos los proveedores
router.get('/', (req, res) => {

    proveedorService.obtenerProveedores((error, proveedores) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar proveedores' });
        res.json(proveedores);
    });

});

//Ruta para registrar un nuevo proveedor
router.post('/', (req, res) => {

    proveedorService.registrarProveedor(req.body, (error, resultado) => {
        if(error) return res.status(500).json({ mensaje: 'Error al registrar proveedor' });
        res.status(201).json({ mensaje: 'Proveedor registrado', id: resultado.id });
    });

});

//Ruta para editar un proveedor
router.put('/:id', (req, res) => {

    proveedorService.editarProveedor(req.params.id, req.body, (error) => {
        if(error) return res.status(500).json({ mensaje: 'Error al editar proveedor' });
        res.json({ mensaje: 'Proveedor actualizado' });
    });

});

//Ruta para desactivar un proveedor
router.put('/:id/desactivar', (req, res) => {

    proveedorService.desactivarProveedor(req.params.id, (error) => {
        if(error) return res.status(500).json({ mensaje: 'Error al desactivar proveedor' });
        res.json({ mensaje: 'Proveedor desactivado' });
    });

});

//Ruta para obtener los productos de un proveedor
router.get('/:id/productos', (req, res) => {

    proveedorService.obtenerProductos(req.params.id, (error, productos) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar productos' });
        res.json(productos);
    });

});

//Ruta para asociar un producto a un proveedor
router.post('/:id/productos', (req, res) => {

    proveedorService.registrarProducto(req.params.id, req.body, (error, resultado) => {
        if(error) return res.status(500).json({ mensaje: 'Error al asociar producto' });
        res.status(201).json({ mensaje: 'Producto asociado', id: resultado.id });
    });

});

//Ruta para actualizar el precio de un producto
router.put('/:id/productos/:relacionId', (req, res) => {

    proveedorService.actualizarPrecio(req.params.id, req.params.relacionId, req.body.precioCompra, (error) => {
        if(error) return res.status(500).json({ mensaje: 'Error al actualizar precio' });
        res.json({ mensaje: 'Precio actualizado' });
    });

});

//Ruta para eliminar la relación de un producto
router.delete('/:id/productos/:relacionId', (req, res) => {

    proveedorService.eliminarProducto(req.params.id, req.params.relacionId, (error) => {
        if(error) return res.status(500).json({ mensaje: 'Error al eliminar relación' });
        res.json({ mensaje: 'Relación eliminada' });
    });

});

module.exports = router;

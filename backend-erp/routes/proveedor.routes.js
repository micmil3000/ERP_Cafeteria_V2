const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedor.controller');

//Ruta para obtener todos los proveedores
router.get('/', proveedorController.obtenerProveedores);

//Ruta para registrar un nuevo proveedor
router.post('/', proveedorController.registrarProveedor);

//Ruta para editar un proveedor
router.put('/:id', proveedorController.editarProveedor);

//Ruta para desactivar un proveedor
router.put('/:id/desactivar', proveedorController.desactivarProveedor);

//Ruta para obtener los productos de un proveedor
router.get('/:id/productos', proveedorController.obtenerProductos);

//Ruta para asociar un producto a un proveedor
router.post('/:id/productos', proveedorController.registrarProducto);

//Ruta para actualizar el precio de un producto
router.put('/:id/productos/:relacionId', proveedorController.actualizarPrecio);

//Ruta para eliminar la relación de un producto
router.delete('/:id/productos/:relacionId', proveedorController.eliminarProducto);

module.exports = router;

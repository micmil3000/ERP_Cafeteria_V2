const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');

//Ruta para obtener todos los productos
router.get('/', productoController.obtenerProductos);
//Función para obtener un solo producto mediante su id
router.get('/:id', productoController.obtenerProductoPorId);
//Función para registrar un nuevo producto
router.post('/', productoController.registrarProducto);
//Función para desactivar un producto
router.put('/:id/desactivar', productoController.desactivarProducto);
//Crear una nueva versión de un producto
router.post('/:id/nueva-version', productoController.crearNuevaVersion);
module.exports = router;
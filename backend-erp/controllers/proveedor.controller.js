const proveedorService = require('../services/proveedor.service');

function obtenerProveedores(req, res) {

    proveedorService.obtenerProveedores((error, proveedores) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar proveedores' });
        res.json(proveedores);
    });

}

function registrarProveedor(req, res) {

    proveedorService.registrarProveedor(req.body, (error, resultado) => {
        if(error) return res.status(500).json({ mensaje: 'Error al registrar proveedor' });
        res.status(201).json({ mensaje: 'Proveedor registrado', id: resultado.id });
    });

}

function editarProveedor(req, res) {

    proveedorService.editarProveedor(req.params.id, req.body, (error) => {
        if(error) return res.status(500).json({ mensaje: 'Error al editar proveedor' });
        res.json({ mensaje: 'Proveedor actualizado' });
    });

}

function desactivarProveedor(req, res) {

    proveedorService.desactivarProveedor(req.params.id, (error) => {
        if(error) return res.status(500).json({ mensaje: 'Error al desactivar proveedor' });
        res.json({ mensaje: 'Proveedor desactivado' });
    });

}

function obtenerProductos(req, res) {

    proveedorService.obtenerProductos(req.params.id, (error, productos) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar productos' });
        res.json(productos);
    });

}

function registrarProducto(req, res) {

    proveedorService.registrarProducto(req.params.id, req.body, (error, resultado) => {
        if(error) return res.status(500).json({ mensaje: 'Error al asociar producto' });
        res.status(201).json({ mensaje: 'Producto asociado', id: resultado.id });
    });

}

function actualizarPrecio(req, res) {

    proveedorService.actualizarPrecio(req.params.id, req.params.relacionId, req.body.precioCompra, (error) => {
        if(error) return res.status(500).json({ mensaje: 'Error al actualizar precio' });
        res.json({ mensaje: 'Precio actualizado' });
    });

}

function eliminarProducto(req, res) {

    proveedorService.eliminarProducto(req.params.id, req.params.relacionId, (error) => {
        if(error) return res.status(500).json({ mensaje: 'Error al eliminar relación' });
        res.json({ mensaje: 'Relación eliminada' });
    });

}

module.exports = {
    obtenerProveedores,
    registrarProveedor,
    editarProveedor,
    desactivarProveedor,
    obtenerProductos,
    registrarProducto,
    actualizarPrecio,
    eliminarProducto
};

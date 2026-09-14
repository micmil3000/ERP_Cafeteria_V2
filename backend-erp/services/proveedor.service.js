const db = require('../config/db');

//Función para obtener todos los proveedores registrados
function obtenerProveedores(callback) {

    //Query para seleccionar todos los proveedores
    const sql = `
        SELECT
            proveedor_id AS id,
            nombre,
            telefono,
            correo,
            direccion,
            estado
        FROM proveedor
        ORDER BY nombre
    `;

    //Ejecuta query para devolver todos los proveedores
    db.query(sql, (error, resultados) => {

        if(error) {
            callback(error, null);
            return;
        }

        callback(null, resultados);

    });

}

//Función para registrar un nuevo proveedor
function registrarProveedor(proveedor, callback) {

    const sql = `
        INSERT INTO proveedor (
            nombre,
            telefono,
            correo,
            direccion,
            estado
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    //Valores a pasar a la query
    const valores = [
        proveedor.nombre,
        proveedor.telefono,
        proveedor.correo,
        proveedor.direccion,
        'ACTIVO'
    ];

    //Ejecuta query para registrar el proveedor
    db.query(sql, valores, (error, resultado) => {

        if(error) {
            callback(error, null);
            return;
        }

        callback(null, {
            id: resultado.insertId
        });

    });

}

//Función para editar la información de un proveedor
function editarProveedor(id, proveedor, callback) {

    const sql = `
        UPDATE proveedor
        SET
            nombre = ?,
            telefono = ?,
            correo = ?,
            direccion = ?
        WHERE proveedor_id = ?
    `;

    const valores = [
        proveedor.nombre,
        proveedor.telefono,
        proveedor.correo,
        proveedor.direccion,
        id
    ];

    //Ejecuta query para modificar el proveedor
    db.query(sql, valores, (error, resultado) => {

        if(error) {
            callback(error, null);
            return;
        }

        callback(null, resultado);

    });

}

//Función para desactivar un proveedor
function desactivarProveedor(id, callback) {

    const sql = `
        UPDATE proveedor
        SET estado = 'INACTIVO'
        WHERE proveedor_id = ?
    `;

    db.query(sql, [id], (error, resultado) => {

        if(error) {
            callback(error, null);
            return;
        }

        callback(null, resultado);

    });

}

//Función para obtener los productos asociados a un proveedor
function obtenerProductos(id, callback) {

    const sql = `
        SELECT
            pp.producto_proveedor_id AS id,
            pp.proveedor_id AS proveedorId,
            pp.producto_id AS productoId,
            p.nombre,
            p.categoria,
            p.stock_actual AS stockActual,
            p.stock_minimo AS stockMinimo,
            pp.precio_compra AS precioCompra
        FROM producto_proveedor pp
        INNER JOIN producto p
            ON pp.producto_id = p.producto_id
        WHERE pp.proveedor_id = ?
        ORDER BY p.nombre
    `;

    db.query(sql, [id], (error, resultados) => {

        if(error) {
            callback(error, null);
            return;
        }

        callback(null, resultados);

    });

}

//Función para asociar un producto a un proveedor
function registrarProducto(id, producto, callback) {

    const sql = `
        INSERT INTO producto_proveedor (
            producto_id,
            proveedor_id,
            precio_compra
        )
        VALUES (?, ?, ?)
    `;

    const valores = [
        producto.productoId,
        id,
        producto.precioCompra
    ];

    db.query(sql, valores, (error, resultado) => {

        if(error) {
            callback(error, null);
            return;
        }

        callback(null, {
            id: resultado.insertId
        });

    });

}

//Función para actualizar el precio de compra de un producto
function actualizarPrecio(id, relacionId, precio, callback) {

    const sql = `
        UPDATE producto_proveedor
        SET precio_compra = ?
        WHERE producto_proveedor_id = ?
            AND proveedor_id = ?
    `;

    const valores = [
        precio,
        relacionId,
        id
    ];

    db.query(sql, valores, (error, resultado) => {

        if(error) {
            callback(error, null);
            return;
        }

        callback(null, resultado);

    });

}

//Función para eliminar la relación de un producto con un proveedor
function eliminarProducto(id, relacionId, callback) {

    const sql = `
        DELETE FROM producto_proveedor
        WHERE producto_proveedor_id = ?
            AND proveedor_id = ?
    `;

    const valores = [
        relacionId,
        id
    ];

    db.query(sql, valores, (error, resultado) => {

        if(error) {
            callback(error, null);
            return;
        }

        callback(null, resultado);

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

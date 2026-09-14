const db = require('../config/db');

//Funcion para obtener todos los productos registrados
function obtenerProductos(callback) {
    const sql = `
        SELECT
            producto_id AS id,
            nombre,
            categoria,
            precio_venta AS precioVenta,
            stock_actual AS stockActual,
            stock_minimo AS stockMinimo,
            descripcion,
            imagen,
            estado
        FROM producto
    `;
    //Ejecuta query para devolver todas las filas de todos los productos
    db.query(sql, (error, resultados) => {
        if(error) {
            callback(error, null);
            return;
        }
        callback(null, resultados);
    });
}

//Función para obtener un solo producto mediante su ID
function obtenerProductoPorId(id, callback) {
    //Query para seleccionar el producto cuyo ID coincida con el id recibido en el parámetro
    const sql = `
        SELECT
            producto_id AS id,
            nombre,
            categoria,
            precio_venta AS precioVenta,
            stock_actual AS stockActual,
            stock_minimo AS stockMinimo,
            descripcion,
            imagen,
            estado
        FROM producto
        WHERE producto_id = ?
    `;
    //Ejecuta la query pasandole el ID a buscar
    db.query(sql, [id], (error, resultados) => {
        if(error) {
            callback(error, null);
            return;
        }
        callback(null, resultados[0]);
    });
}

//Función para agregar un nuevo producto
function registrarProducto(producto, callback){
    //Query sql para insertar un nuevo producto, con placeholders, ya que después se mandan los valores
    const sql = `INSERT INTO producto (
        nombre, 
        categoria, 
        precio_venta,
        stock_actual,
        stock_minimo,
        descripcion,
        imagen,
        estado
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    //Valores a pasar a la query en el orden asignado en la query sql
    const valores = [
        producto.nombre,
        producto.categoria,
        producto.precioVenta,
        producto.stockActual, 
        producto.stockMinimo,
        producto.descripcion,
        producto.imagen,
        'ACTIVO'
    ];
    //Ejecuta la query pasandole los valores del producto a agregar
    db.query(sql, valores, (error, resultado) => {
        if(error) {
            callback(error, null);
            return;
        }
        callback(null, resultado);
    });
}

function desactivarProducto(id, callback) {
    //Query sql para modificar el campo estado del producto a INACTIVO, sin pasar directamente el id
    const sql = `
        UPDATE producto
        SET estado = 'INACTIVO'
        WHERE producto_id = ?
    `;
    //Ejecuta la query pasandole el valor del id
    db.query(sql, [id], (error, resultado) => {
        if(error){
            callback(error, null);
            return;
        }
        callback(null, resultado);
    });
}

//Función para crear una nueva versión de un producto existente
function crearNuevaVersion(id, producto, callback) {
    //Transacción para deshacer acciones en caso que haya problema en alguna de las queries

    db.beginTransaction((error) => {
        if(error) {
            callback(error, null);
            return;
        }
        //Primero intenta desactivar la versión anterior
        const sqlDesactivar = `
            UPDATE producto
            SET estado = 'INACTIVO'
            WHERE producto_id = ?
        `;

        db.query(sqlDesactivar, [id], (error, resultado) => {
            if(error) {
                //En caso de error hace rollback
                db.rollback(() => {
                    callback(error, null);
                });
                return;
            }
            //Caso ninguna row fue afectada, es decir no se hizo ningún update hace rollback
            if (resultado.affectedRows === 0) {
                db.rollback(() => {
                    callback(new Error('Producto no encontrado'), null);
                });
                return;
            }
            //Posteriormente registra la nueva versión del producto
            const sqlRegistrar = `
                INSERT INTO producto (
                    nombre,
                    categoria,
                    precio_venta,
                    stock_actual,
                    stock_minimo,
                    descripcion,
                    imagen,
                    estado
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const valores = [
                producto.nombre,
                producto.categoria,
                producto.precioVenta,
                producto.stockActual,
                producto.stockMinimo,
                producto.descripcion,
                producto.imagen,
                'ACTIVO'
            ];
            db.query(sqlRegistrar, valores, (error, resultado) => {
                //En caso haya un error hace rollback
                if(error) {
                    db.rollback(() => {
                        callback(error, null);
                    });
                    return;
                }
                //De lo contrario hace commit en la transacción
                db.commit((error) => {
                    if(error) {
                        db.rollback(() => {
                            callback(error, null);
                        });
                        return;
                    }
                    callback(null, resultado);
                });
            });
        });
    });
}

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    registrarProducto,
    desactivarProducto,
    crearNuevaVersion
};
const db = require('../config/db');

//Función para obtener todas las compras registradas
function obtenerCompras(callback) {

    const sql = `
        SELECT
            c.compra_id AS id,
            c.proveedor_id AS proveedorId,
            pr.nombre AS proveedorNombre,
            c.fecha_hora AS fechaHora,
            c.subtotal,
            c.iva,
            c.total,
            CONCAT(p.nombre, ' ', p.apellidos) AS usuarioResponsable
        FROM compra c
        INNER JOIN proveedor pr
            ON c.proveedor_id = pr.proveedor_id
        INNER JOIN perfil p
            ON c.usuario_id = p.usuario_id
        ORDER BY c.fecha_hora DESC
    `;

    db.query(sql, (error, compras) => {

        if(error) {
            callback(error, null);
            return;
        }

        callback(null, compras);

    });

}

//Función para obtener una compra mediante su ID
function obtenerCompraPorId(id, callback) {

    const sqlCompra = `
        SELECT
            c.compra_id AS id,
            c.proveedor_id AS proveedorId,
            pr.nombre AS proveedorNombre,
            c.fecha_hora AS fechaHora,
            c.subtotal,
            c.iva,
            c.total,
            CONCAT(p.nombre, ' ', p.apellidos) AS usuarioResponsable
        FROM compra c
        INNER JOIN proveedor pr
            ON c.proveedor_id = pr.proveedor_id
        INNER JOIN perfil p
            ON c.usuario_id = p.usuario_id
        WHERE c.compra_id = ?
    `;

    db.query(sqlCompra, [id], (error, compras) => {

        if(error) {
            callback(error, null);
            return;
        }

        if(!compras[0]) {
            callback(null, null);
            return;
        }

        const sqlDetalles = `
            SELECT
                dc.detalle_compra_id AS id,
                pp.producto_id AS productoId,
                p.nombre,
                dc.cantidad,
                dc.precio_unitario AS precioCompra,
                dc.subtotal
            FROM detalle_compra dc
            INNER JOIN producto_proveedor pp
                ON dc.producto_proveedor_id = pp.producto_proveedor_id
            INNER JOIN producto p
                ON pp.producto_id = p.producto_id
            WHERE dc.compra_id = ?
        `;

        db.query(sqlDetalles, [id], (error, detalles) => {

            if(error) {
                callback(error, null);
                return;
            }

            callback(null, {
                ...compras[0],
                detalles
            });

        });

    });

}

//Función para registrar una nueva compra
function registrarCompra(compra, callback) {

    if(!Array.isArray(compra.detalles) || !compra.detalles.length) {
        callback(new Error('Detalles inválidos'), null);
        return;
    }

    //Transacción para deshacer acciones si falla alguna query
    db.beginTransaction((error) => {

        if(error) {
            callback(error, null);
            return;
        }

        const relacionesIds = compra.detalles.map((detalle) => detalle.productoProveedorId);

        //Obtiene los precios reales de los productos del proveedor
        const sqlRelaciones = `
            SELECT
                pp.producto_proveedor_id AS id,
                pp.producto_id AS productoId,
                pp.precio_compra AS precioCompra
            FROM producto_proveedor pp
            INNER JOIN proveedor pr
                ON pp.proveedor_id = pr.proveedor_id
            WHERE pp.proveedor_id = ?
                AND pr.estado = 'ACTIVO'
                AND pp.producto_proveedor_id IN (?)
            FOR UPDATE
        `;

        const valoresRelaciones = [
            compra.proveedorId,
            relacionesIds
        ];

        db.query(sqlRelaciones, valoresRelaciones, (error, relaciones) => {

            if(error) {
                db.rollback(() => callback(error, null));
                return;
            }

            if(relaciones.length !== new Set(relacionesIds).size) {
                db.rollback(() => callback(new Error('Producto de proveedor inválido'), null));
                return;
            }

            let subtotalCentavos = 0;
            const detalles = [];

            //Calcula los importes con los precios obtenidos de MySQL
            for(const detalleCompra of compra.detalles) {
                const relacion = relaciones.find((producto) => producto.id === Number(detalleCompra.productoProveedorId));
                const cantidad = Number(detalleCompra.cantidad);

                if(!relacion || !Number.isInteger(cantidad) || cantidad < 1) {
                    db.rollback(() => callback(new Error('Cantidad inválida'), null));
                    return;
                }

                const precioCentavos = Math.round(Number(relacion.precioCompra) * 100);
                subtotalCentavos += precioCentavos * cantidad;

                detalles.push({
                    relacionId: relacion.id,
                    productoId: relacion.productoId,
                    cantidad,
                    precio: precioCentavos / 100,
                    subtotal: precioCentavos * cantidad / 100
                });
            }

            //Calcula subtotal, IVA y total de la compra
            const ivaCentavos = Math.round(subtotalCentavos * 0.16);
            const subtotal = subtotalCentavos / 100;
            const iva = ivaCentavos / 100;
            const total = (subtotalCentavos + ivaCentavos) / 100;

            const sqlCompra = `
                INSERT INTO compra (
                    proveedor_id,
                    usuario_id,
                    fecha_hora,
                    subtotal,
                    iva,
                    total
                )
                VALUES (?, ?, NOW(), ?, ?, ?)
            `;

            const valoresCompra = [
                compra.proveedorId,
                compra.usuarioId,
                subtotal,
                iva,
                total
            ];

            db.query(sqlCompra, valoresCompra, (error, resultadoCompra) => {

                if(error) {
                    db.rollback(() => callback(error, null));
                    return;
                }

                const compraId = resultadoCompra.insertId;

                //Registra los detalles de la compra
                const sqlDetalles = `
                    INSERT INTO detalle_compra (
                        compra_id,
                        producto_proveedor_id,
                        cantidad,
                        precio_unitario,
                        subtotal
                    )
                    VALUES ?
                `;

                const valoresDetalles = detalles.map((detalle) => [
                    compraId,
                    detalle.relacionId,
                    detalle.cantidad,
                    detalle.precio,
                    detalle.subtotal
                ]);

                db.query(sqlDetalles, [valoresDetalles], (error) => {

                    if(error) {
                        db.rollback(() => callback(error, null));
                        return;
                    }

                    //Actualiza el stock de cada producto comprado
                    actualizarStock(detalles, 0, (error) => {

                        if(error) {
                            db.rollback(() => callback(error, null));
                            return;
                        }

                        registrarMovimiento(compra, compraId, subtotal, iva, total, (error) => {

                            if(error) {
                                db.rollback(() => callback(error, null));
                                return;
                            }

                            db.commit((error) => {

                                if(error) {
                                    db.rollback(() => callback(error, null));
                                    return;
                                }

                                callback(null, {
                                    id: compraId
                                });

                            });

                        });

                    });

                });

            });

        });

    });

}

//Actualiza el stock de cada producto comprado
function actualizarStock(detalles, indice, callback) {

    if(indice === detalles.length) {
        callback(null);
        return;
    }

    const detalle = detalles[indice];

    const sqlStock = `
        UPDATE producto
        SET stock_actual = stock_actual + ?
        WHERE producto_id = ?
    `;

    const valoresStock = [
        detalle.cantidad,
        detalle.productoId
    ];

    db.query(sqlStock, valoresStock, (error) => {

        if(error) {
            callback(error);
            return;
        }

        actualizarStock(detalles, indice + 1, callback);

    });

}

//Registra el gasto de la compra en movimientos financieros
function registrarMovimiento(compra, compraId, subtotal, iva, total, callback) {

    const sqlMovimiento = `
        INSERT INTO movimiento_financiero (
            usuario_id,
            fecha_hora,
            tipo,
            origen,
            referencia_origen,
            concepto,
            categoria,
            subtotal,
            iva,
            total,
            metodo_pago,
            observaciones
        )
        VALUES (?, NOW(), 'GASTO', 'COMPRA', ?, ?, 'Compras', ?, ?, ?, ?, NULL)
    `;

    const valoresMovimiento = [
        compra.usuarioId,
        String(compraId),
        'Compra #' + compraId,
        subtotal,
        iva,
        total,
        compra.metodoPago || null
    ];

    db.query(sqlMovimiento, valoresMovimiento, (error, resultado) => {

        if(error) {
            callback(error, null);
            return;
        }

        callback(null, resultado);

    });

}

module.exports = {

    obtenerCompras,

    obtenerCompraPorId,

    registrarCompra

};

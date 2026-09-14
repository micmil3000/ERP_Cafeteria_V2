const db = require('../config/db');

//Función para obtener todas las ventas
function obtenerVentas(callback) {

    const sql = `
        SELECT
            v.venta_id AS id,
            v.numero_venta AS numeroVenta,
            v.fecha_hora AS fechaHora,
            v.subtotal,
            v.iva,
            v.total,
            CONCAT(p.nombre, ' ', p.apellidos) AS usuario,
            (SELECT COUNT(*) FROM detalle_venta dv WHERE dv.venta_id = v.venta_id) AS cantidadProductos,
            EXISTS(SELECT 1 FROM factura f WHERE f.venta_id = v.venta_id) AS facturada
        FROM venta v
        INNER JOIN perfil p
            ON v.usuario_id = p.usuario_id
        ORDER BY v.fecha_hora DESC
    `;

    db.query(sql, (error, ventas) => {

        if(error) {
            callback(error, null);
            return;
        }

        callback(null, ventas);

    });

}

//Función para obtener una venta mediante su ID
function obtenerVentaPorId(id, callback) {

    const sqlVenta = `
        SELECT
            v.venta_id AS id,
            v.numero_venta AS numeroVenta,
            v.fecha_hora AS fechaHora,
            v.subtotal,
            v.iva,
            v.total,
            CONCAT(p.nombre, ' ', p.apellidos) AS usuario,
            m.metodo_pago AS metodoPago,
            m.referencia_origen AS referenciaOrigen
        FROM venta v
        INNER JOIN perfil p
            ON v.usuario_id = p.usuario_id
        LEFT JOIN movimiento_financiero m
            ON m.origen = 'VENTA'
            AND m.referencia_origen = v.numero_venta
        WHERE v.venta_id = ?
    `;

    db.query(sqlVenta, [id], (error, ventas) => {

        if(error) {
            callback(error, null);
            return;
        }

        if(!ventas[0]) {
            callback(null, null);
            return;
        }

        const sqlDetalles = `
            SELECT
                dv.detalle_venta_id AS id,
                dv.producto_id AS productoId,
                p.nombre,
                dv.cantidad,
                dv.precio_unitario AS precioUnitario,
                dv.subtotal
            FROM detalle_venta dv
            INNER JOIN producto p
                ON dv.producto_id = p.producto_id
            WHERE dv.venta_id = ?
        `;

        db.query(sqlDetalles, [id], (error, detalles) => {

            if(error) {
                callback(error, null);
                return;
            }

            callback(null, {
                ...ventas[0],
                detalles
            });

        });

    });

}

//Función para registrar una nueva venta
function registrarVenta(venta, callback) {

    if(!Array.isArray(venta.detalles) || !venta.detalles.length) {
        callback(new Error('Detalles inválidos'), null);
        return;
    }

    //Transacción para mantener la venta completa
    db.beginTransaction((error) => {

        if(error) {
            callback(error, null);
            return;
        }

        const productosIds = venta.detalles.map((detalle) => detalle.productoId);

        //Obtiene precios y existencias reales desde MySQL
        const sqlProductos = `
            SELECT
                producto_id AS id,
                nombre,
                precio_venta AS precioVenta,
                stock_actual AS stockActual
            FROM producto
            WHERE estado = 'ACTIVO'
                AND producto_id IN (?)
            FOR UPDATE
        `;

        db.query(sqlProductos, [productosIds], (error, productos) => {

            if(error) {
                db.rollback(() => callback(error, null));
                return;
            }

            if(productos.length !== new Set(productosIds).size) {
                db.rollback(() => callback(new Error('Producto no disponible'), null));
                return;
            }

            let subtotalCentavos = 0;
            const detalles = [];

            for(const detalleVenta of venta.detalles) {
                const producto = productos.find((item) => item.id === Number(detalleVenta.productoId));
                const cantidad = Number(detalleVenta.cantidad);

                if(!producto || !Number.isInteger(cantidad) || cantidad < 1 || cantidad > producto.stockActual) {
                    db.rollback(() => callback(new Error('Stock insuficiente'), null));
                    return;
                }

                const precioCentavos = Math.round(Number(producto.precioVenta) * 100);
                subtotalCentavos += precioCentavos * cantidad;

                detalles.push({
                    productoId: producto.id,
                    cantidad,
                    precio: precioCentavos / 100,
                    subtotal: precioCentavos * cantidad / 100
                });
            }

            //Calcula nuevamente subtotal, IVA y total
            const ivaCentavos = Math.round(subtotalCentavos * 0.16);
            const subtotal = subtotalCentavos / 100;
            const iva = ivaCentavos / 100;
            const total = (subtotalCentavos + ivaCentavos) / 100;

            const sqlVenta = `
                INSERT INTO venta (
                    usuario_id,
                    numero_venta,
                    fecha_hora,
                    subtotal,
                    iva,
                    total
                )
                VALUES (?, NULL, NOW(), ?, ?, ?)
            `;

            const valoresVenta = [
                venta.usuarioId,
                subtotal,
                iva,
                total
            ];

            db.query(sqlVenta, valoresVenta, (error, resultadoVenta) => {

                if(error) {
                    db.rollback(() => callback(error, null));
                    return;
                }

                const ventaId = resultadoVenta.insertId;
                const numeroVenta = 'V-' + String(ventaId);

                const sqlNumero = `
                    UPDATE venta
                    SET numero_venta = ?
                    WHERE venta_id = ?
                `;

                db.query(sqlNumero, [numeroVenta, ventaId], (error) => {

                    if(error) {
                        db.rollback(() => callback(error, null));
                        return;
                    }

                    //Registra los detalles de la venta
                    const sqlDetalles = `
                        INSERT INTO detalle_venta (
                            venta_id,
                            producto_id,
                            cantidad,
                            precio_unitario,
                            subtotal
                        )
                        VALUES ?
                    `;

                    const valoresDetalles = detalles.map((detalle) => [
                        ventaId,
                        detalle.productoId,
                        detalle.cantidad,
                        detalle.precio,
                        detalle.subtotal
                    ]);

                    db.query(sqlDetalles, [valoresDetalles], (error) => {

                        if(error) {
                            db.rollback(() => callback(error, null));
                            return;
                        }

                        //Disminuye las existencias de los productos vendidos
                        actualizarStockVenta(detalles, 0, (error) => {

                            if(error) {
                                db.rollback(() => callback(error, null));
                                return;
                            }

                            registrarMovimiento(venta, numeroVenta, subtotal, iva, total, (error) => {

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
                                        id: ventaId,
                                        numeroVenta
                                    });

                                });

                            });

                        });

                    });

                });

            });

        });

    });

}

//Actualiza el stock de los productos vendidos
function actualizarStockVenta(detalles, indice, callback) {

    if(indice === detalles.length) {
        callback(null);
        return;
    }

    const detalle = detalles[indice];

    const sqlStock = `
        UPDATE producto
        SET stock_actual = stock_actual - ?
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

        actualizarStockVenta(detalles, indice + 1, callback);

    });

}

//Registra el ingreso de la venta en movimientos financieros
function registrarMovimiento(venta, numeroVenta, subtotal, iva, total, callback) {

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
        VALUES (?, NOW(), 'INGRESO', 'VENTA', ?, ?, 'Ventas', ?, ?, ?, ?, NULL)
    `;

    const valoresMovimiento = [
        venta.usuarioId,
        numeroVenta,
        'Venta ' + numeroVenta,
        subtotal,
        iva,
        total,
        venta.metodoPago || null
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

    obtenerVentas,

    obtenerVentaPorId,

    registrarVenta

};

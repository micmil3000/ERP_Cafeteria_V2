const db = require('../config/db');

//Agrega los filtros recibidos a una consulta
function obtenerFiltros(filtros, valores) {

    const condiciones = [];

    if(filtros.desde) {
        condiciones.push('DATE(m.fecha_hora) >= ?');
        valores.push(filtros.desde);
    }

    if(filtros.hasta) {
        condiciones.push('DATE(m.fecha_hora) <= ?');
        valores.push(filtros.hasta);
    }

    if(filtros.tipo) {
        condiciones.push('m.tipo = ?');
        valores.push(filtros.tipo);
    }

    if(filtros.categoria) {
        condiciones.push('m.categoria = ?');
        valores.push(filtros.categoria);
    }

    if(filtros.origen) {
        condiciones.push('m.origen = ?');
        valores.push(filtros.origen);
    }

    return condiciones;

}

//Función para obtener los movimientos financieros
function obtenerMovimientos(filtros, callback) {

    const valores = [];
    const condiciones = obtenerFiltros(filtros, valores);
    const where = condiciones.length ? ' WHERE ' + condiciones.join(' AND ') : '';

    const sql = `
        SELECT
            m.movimiento_id AS id,
            m.usuario_id AS usuarioId,
            m.fecha_hora AS fechaHora,
            m.tipo,
            m.origen,
            m.referencia_origen AS referenciaOrigen,
            m.concepto,
            m.categoria,
            m.subtotal,
            m.iva,
            m.total,
            m.metodo_pago AS metodoPago,
            m.observaciones,
            CONCAT(p.nombre, ' ', p.apellidos) AS usuario
        FROM movimiento_financiero m
        INNER JOIN perfil p
            ON m.usuario_id = p.usuario_id
        ${where}
        ORDER BY m.fecha_hora DESC, m.movimiento_id DESC
    `;

    db.query(sql, valores, (error, movimientos) => {

        if(error) {
            callback(error, null);
            return;
        }

        callback(null, movimientos);

    });

}

//Función para obtener un movimiento mediante su ID
function obtenerMovimientoPorId(id, callback) {

    const sql = `
        SELECT
            m.movimiento_id AS id,
            m.usuario_id AS usuarioId,
            m.fecha_hora AS fechaHora,
            m.tipo,
            m.origen,
            m.referencia_origen AS referenciaOrigen,
            m.concepto,
            m.categoria,
            m.subtotal,
            m.iva,
            m.total,
            m.metodo_pago AS metodoPago,
            m.observaciones,
            CONCAT(p.nombre, ' ', p.apellidos) AS usuario
        FROM movimiento_financiero m
        INNER JOIN perfil p
            ON m.usuario_id = p.usuario_id
        WHERE m.movimiento_id = ?
    `;

    db.query(sql, [id], (error, resultados) => {

        if(error) {
            callback(error, null);
            return;
        }

        callback(null, resultados[0]);

    });

}

//Función para registrar un gasto manual
function registrarGasto(gasto, callback) {

    //Calcula nuevamente el IVA y total en backend
    const subtotal = Math.round(Number(gasto.subtotal) * 100) / 100;
    const iva = Math.round(subtotal * 16) / 100;
    const total = Math.round((subtotal + iva) * 100) / 100;

    const sql = `
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
        VALUES (?, ?, 'GASTO', 'MANUAL', NULL, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        gasto.usuarioId,
        gasto.fechaHora,
        gasto.concepto,
        gasto.categoria,
        subtotal,
        iva,
        total,
        gasto.metodoPago || null,
        gasto.observaciones || null
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

//Función para obtener el resumen financiero
function obtenerResumen(filtros, callback) {

    const valores = [];
    const condiciones = obtenerFiltros(filtros, valores);
    const where = condiciones.length ? ' WHERE ' + condiciones.join(' AND ') : '';

    const sql = `
        SELECT
            COALESCE(SUM(CASE WHEN m.tipo = 'INGRESO' THEN m.total ELSE 0 END), 0) AS ingresos,
            COALESCE(SUM(CASE WHEN m.tipo = 'GASTO' THEN m.total ELSE 0 END), 0) AS gastos
        FROM movimiento_financiero m
        ${where}
    `;

    db.query(sql, valores, (error, resultados) => {

        if(error) {
            callback(error, null);
            return;
        }

        callback(null, resultados[0]);

    });

}

//Función para obtener los gastos agrupados por categoría
function obtenerGastosPorCategoria(filtros, callback) {

    const valores = [];
    const condiciones = obtenerFiltros(filtros, valores);
    condiciones.push("m.tipo = 'GASTO'");

    const sql = `
        SELECT
            m.categoria,
            SUM(m.total) AS total
        FROM movimiento_financiero m
        WHERE ${condiciones.join(' AND ')}
        GROUP BY m.categoria
        ORDER BY total DESC
    `;

    db.query(sql, valores, (error, gastos) => {

        if(error) {
            callback(error, null);
            return;
        }

        callback(null, gastos);

    });

}

module.exports = {

    obtenerMovimientos,

    obtenerMovimientoPorId,

    registrarGasto,

    obtenerResumen,

    obtenerGastosPorCategoria

};

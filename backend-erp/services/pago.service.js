const db = require('../config/db');

//Query base para consultar pagos de salario
const selectPagos = `
    SELECT
        ps.pago_salario_id AS id,
        ps.perfil_trabajador_id AS funcionarioId,
        CONCAT(p.nombre, ' ', p.apellidos) AS trabajador,
        ps.periodo_inicio AS periodoInicio,
        ps.periodo_fin AS periodoFin,
        ps.fecha_pago AS fechaPago,
        ps.monto,
        CONCAT(pr.nombre, ' ', pr.apellidos) AS responsable
    FROM pago_salario ps
    INNER JOIN perfil p
        ON ps.perfil_trabajador_id = p.perfil_id
    INNER JOIN perfil pr
        ON ps.usuario_responsable_id = pr.usuario_id
`;

//Función para obtener todos los pagos
function obtenerPagos(callback) {

    const sql = selectPagos + `
        ORDER BY ps.fecha_pago DESC
    `;

    db.query(sql, (error, pagos) => {

        if(error) {
            callback(error, null);
            return;
        }

        callback(null, pagos);

    });

}

//Función para obtener un pago mediante su ID
function obtenerPagoPorId(id, callback) {

    const sql = selectPagos + `
        WHERE ps.pago_salario_id = ?
    `;

    db.query(sql, [id], (error, resultados) => {

        if(error) {
            callback(error, null);
            return;
        }

        callback(null, resultados[0]);

    });

}

module.exports = {

    obtenerPagos,

    obtenerPagoPorId

};

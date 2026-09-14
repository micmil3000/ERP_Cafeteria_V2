const db = require('../config/db');

function obtenerFuncionarios(callback) {
    const sql = `
        SELECT 
            p.perfil_id AS id,
            p.nombre,
            p.apellidos,
            u.rol,
            u.correo,
            p.telefono,
            p.fecha_contratacion AS fechaContratacion,
            p.salario,
            p.estado
        FROM perfil p
        INNER JOIN usuario u
            ON p.usuario_id = u.usuario_id
    `;
    
    db.query(sql, (error, resultados) => {
        if(error) {
            callback(error, null);
            return;
        }
        callback(null, resultados);
    });
}

function obtenerFuncionarioPorId(id, callback) {
    const sql = `
        SELECT
            p.perfil_id AS id,
            p.nombre,
            p.apellidos,
            u.rol, 
            u.correo,
            p.telefono,
            p.fecha_contratacion AS fechaContratacion,
            p.salario,
            p.estado
        FROM perfil p
        INNER JOIN usuario u
            ON p.usuario_id = u.usuario_id
        WHERE p.perfil_id = ?
    `;

    db.query(sql, [id], (error, resultados) => {
        if(error) {
            callback(error, null);
            return;
        }
        callback(null, resultados[0]);
    });
}

function obtenerHorario(id, callback) {
    const sql = `
        SELECT h.horario_id AS id, h.perfil_id AS perfilId, h.dia_semana AS diaSemana,
            h.hora_entrada AS horaEntrada, h.hora_salida AS horaSalida
        FROM horario h
        WHERE h.perfil_id = ?
        ORDER BY FIELD(h.dia_semana, 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO')
    `;
    db.query(sql, [id], (error, horario) => {

        if(error) {
            callback(error, null);
            return;
        }

        callback(null, horario);

    });
}

function obtenerAsistencias(id, callback) {
    const sql = `
        SELECT a.asistencia_id AS id, a.perfil_id AS funcionarioId, a.fecha,
            a.hora_entrada_registrada AS horaEntrada, a.hora_salida_registrada AS horaSalida,
            a.estado
        FROM asistencia a WHERE a.perfil_id = ? ORDER BY a.fecha DESC, a.asistencia_id DESC
    `;
    db.query(sql, [id], (error, asistencias) => {

        if(error) {
            callback(error, null);
            return;
        }

        callback(null, asistencias);

    });
}

function obtenerPagos(id, callback) {
    const sql = `
        SELECT ps.pago_salario_id AS id, ps.perfil_trabajador_id AS funcionarioId,
            CONCAT(p.nombre, ' ', p.apellidos) AS trabajador,
            ps.periodo_inicio AS periodoInicio, ps.periodo_fin AS periodoFin,
            ps.fecha_pago AS fechaPago, ps.monto,
            CONCAT(pr.nombre, ' ', pr.apellidos) AS responsable
        FROM pago_salario ps
        INNER JOIN perfil p ON ps.perfil_trabajador_id = p.perfil_id
        INNER JOIN perfil pr ON ps.usuario_responsable_id = pr.usuario_id
        WHERE ps.perfil_trabajador_id = ? ORDER BY ps.fecha_pago DESC
    `;
    db.query(sql, [id], (error, pagos) => {

        if(error) {
            callback(error, null);
            return;
        }

        callback(null, pagos);

    });
}

module.exports = {
    obtenerFuncionarios,
    obtenerFuncionarioPorId,
    obtenerHorario,
    obtenerAsistencias,
    obtenerPagos
};

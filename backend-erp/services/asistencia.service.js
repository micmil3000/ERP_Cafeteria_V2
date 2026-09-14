const db = require('../config/db');

//Función para obtener todas las asistencias
function obtenerAsistencias(callback) {

    const sql = `
        SELECT
            a.asistencia_id AS id,
            a.perfil_id AS funcionarioId,
            CONCAT(p.nombre, ' ', p.apellidos) AS funcionario,
            a.fecha,
            a.hora_entrada_registrada AS horaEntrada,
            a.hora_salida_registrada AS horaSalida,
            a.estado
        FROM asistencia a
        INNER JOIN perfil p
            ON a.perfil_id = p.perfil_id
        ORDER BY a.fecha DESC, a.asistencia_id DESC
    `;

    db.query(sql, (error, asistencias) => {

        if(error) {
            callback(error, null);
            return;
        }

        callback(null, asistencias);

    });

}

module.exports = {

    obtenerAsistencias

};

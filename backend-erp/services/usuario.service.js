const db = require('../config/db');

//Función para iniciar sesión
function login(correo, password, callback) {

    const sql = `
        SELECT
            u.usuario_id AS id,
            u.correo,
            u.rol,
            u.estado,
            p.perfil_id AS perfilId,
            p.nombre,
            p.apellidos
        FROM usuario u
        LEFT JOIN perfil p
            ON u.usuario_id = p.usuario_id
        WHERE u.correo = ?
            AND u.password_hash = ?
            AND u.estado = 'ACTIVO'
    `;

    const valores = [
        correo,
        password
    ];

    db.query(sql, valores, (error, resultados) => {

        if(error) {
            callback(error, null);
            return;
        }

        callback(null, resultados[0]);

    });

}

module.exports = {

    login

};

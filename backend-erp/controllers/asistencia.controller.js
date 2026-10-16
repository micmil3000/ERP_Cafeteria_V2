const asistenciaService = require('../services/asistencia.service');

function obtenerAsistencias(req, res) {

    asistenciaService.obtenerAsistencias((error, asistencias) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar asistencias' });
        res.json(asistencias);
    });

}

module.exports = {
    obtenerAsistencias
};

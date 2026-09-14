const express = require('express');
const router = express.Router();
const asistenciaService = require('../services/asistencia.service');

//Ruta para consultar todas las asistencias
router.get('/', (req, res) => {

    asistenciaService.obtenerAsistencias((error, asistencias) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar asistencias' });
        res.json(asistencias);
    });

});

module.exports = router;

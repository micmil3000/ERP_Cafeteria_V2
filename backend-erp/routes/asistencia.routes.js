const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/asistencia.controller');

//Ruta para consultar todas las asistencias
router.get('/', asistenciaController.obtenerAsistencias);

module.exports = router;

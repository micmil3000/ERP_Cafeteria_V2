const express = require('express');
const router = express.Router();
const funcionarioController = require('../controllers/funcionario.controller');

//Ruta para obtener todos los funcionarios
router.get('/', funcionarioController.obtenerFuncionarios);

//Función para obtener un funcionario en base a su ID
router.get('/:id/horario', funcionarioController.obtenerHorario);

router.get('/:id/asistencias', funcionarioController.obtenerAsistencias);

router.get('/:id/pagos', funcionarioController.obtenerPagos);

router.get('/:id', funcionarioController.obtenerFuncionarioPorId);

module.exports = router;

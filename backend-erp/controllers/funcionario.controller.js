const funcionarioService = require('../services/funcionario.service');

function obtenerFuncionarios(req, res) {
    //Llama al método de funcionarioService para obtener todos los funcionarios
    funcionarioService.obtenerFuncionarios(
        (error, funcionarios) => {
            if(error) {
                return res.status(500).json({
                    mensaje: 'Error al consultar funcionarios'
                });
            }
            //Devuelve funcionarios encontrados
            res.json(funcionarios);
        }
    );
}

function obtenerHorario(req, res) {
    funcionarioService.obtenerHorario(req.params.id, (error, horario) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar horario' });
        res.json(horario);
    });
}

function obtenerAsistencias(req, res) {
    funcionarioService.obtenerAsistencias(req.params.id, (error, asistencias) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar asistencias' });
        res.json(asistencias);
    });
}

function obtenerPagos(req, res) {
    funcionarioService.obtenerPagos(req.params.id, (error, pagos) => {
        if(error) return res.status(500).json({ mensaje: 'Error al consultar pagos' });
        res.json(pagos);
    });
}

function obtenerFuncionarioPorId(req, res) {
    const id = req.params.id;

    funcionarioService.obtenerFuncionarioPorId(id, (error, funcionario) => {
        //Maneja errores al consultar el funcionario
        if(error) {
            return res.status(500).json({
                mensaje: 'Error al consultar funcionario'
            });
        }
        //Maneja error si no encuentra ningún funcionario con ese ID
        if(!funcionario) {
            return res.status(404).json({
                mensaje: 'Funcionario no encontrado'
            });
        }
        //Devuelve el funcionario encontrado
        res.json(funcionario);
    });
}

module.exports = {
    obtenerFuncionarios,
    obtenerHorario,
    obtenerAsistencias,
    obtenerPagos,
    obtenerFuncionarioPorId
};

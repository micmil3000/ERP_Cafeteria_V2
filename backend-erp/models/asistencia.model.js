class Asistencia {
    constructor(id, perfilId, fecha, horaEntradaRegistrada, horaSalidaRegistrada, estado) {
        this.id = id;
        this.perfilId = perfilId;
        this.fecha = fecha;
        this.horaEntradaRegistrada = horaEntradaRegistrada;
        this.horaSalidaRegistrada = horaSalidaRegistrada;
        this.estado = estado;
    }
}

module.exports = Asistencia;
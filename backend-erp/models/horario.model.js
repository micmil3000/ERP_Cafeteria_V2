class Horario {
    constructor(id, perfilId, diaSemana, horaEntrada, horaSalida) {
        this.id = id;
        this.perfilId = perfilId;
        this.diaSemana = diaSemana;
        this.horaEntrada = horaEntrada;
        this.horaSalida = horaSalida;
    }
}

module.exports = Horario;
class PagoSalario {
    constructor(id, perfilTrabajadorId, usuarioResponsableId, periodoInicio, periodoFin, fechaPago, monto) {
        this.id = id;
        this.perfilTrabajadorId = perfilTrabajadorId;
        this.usuarioResponsableId = usuarioResponsableId;
        this.periodoInicio = periodoInicio;
        this.periodoFin = periodoFin;
        this.fechaPago = fechaPago;
        this.monto = monto;
    }
}

module.exports = PagoSalario;
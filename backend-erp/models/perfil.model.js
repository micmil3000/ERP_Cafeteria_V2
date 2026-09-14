class Perfil {
    constructor(id, usuarioId, nombre, apellidos, telefono, fechaContratacion, salario, estado) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.telefono = telefono;
        this.fechaContratacion = fechaContratacion;
        this.salario = salario;
        this.estado = estado;
    }
}

module.exports = Perfil;
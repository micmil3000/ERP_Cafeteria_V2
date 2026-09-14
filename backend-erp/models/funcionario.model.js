class Funcionario {
    constructor(id, nombre, apellidos, rol, correo, telefono,fechaContratacion, salario, estado) {
        this.id = id;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.rol = rol;
        this.correo = correo;
        this.telefono = telefono;
        this.fechaContratacion = fechaContratacion;
        this.salario = salario;
        this.estado = estado;
    }
}

module.exports = Funcionario;
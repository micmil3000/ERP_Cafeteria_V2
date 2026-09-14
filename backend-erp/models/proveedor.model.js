class Proveedor {
    constructor(id, nombre, telefono, correo, direccion, estado) {
        this.id = id;
        this.nombre = nombre;
        this.telefono = telefono;
        this.correo = correo;
        this.direccion = direccion;
        this.estado = estado;
    }
}

module.exports = Proveedor;
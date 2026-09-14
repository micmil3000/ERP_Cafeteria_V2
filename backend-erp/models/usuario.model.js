class Usuario {
    constructor(id, correo, passwordHash, rol, estado) {
        this.id = id;
        this.correo = correo;
        this.passwordHash = passwordHash;
        this.rol = rol;
        this.estado = estado;
    }
}

module.exports = Usuario;
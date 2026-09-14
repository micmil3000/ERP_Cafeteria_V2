class Compra {
    constructor(id, proveedorId, usuarioId, fechaHora, subtotal, iva, total) {
        this.id = id;
        this.proveedorId = proveedorId;
        this.usuarioId = usuarioId;
        this.fechaHora = fechaHora;
        this.subtotal = subtotal;
        this.iva = iva;
        this.total = total;
    }
}

module.exports = Compra;
class Venta {
    constructor(id, usuarioId, numeroVenta, fechaHora, subtotal, iva, total) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.numeroVenta = numeroVenta;
        this.fechaHora = fechaHora;
        this.subtotal = subtotal;
        this.iva = iva;
        this.total = total;
    }
}

module.exports = Venta;
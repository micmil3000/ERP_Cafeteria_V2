class DetalleVenta {
    constructor(id, ventaId, productoId, cantidad, precioUnitario, subtotal) {
        this.id = id;
        this.ventaId = ventaId;
        this.productoId = productoId;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
    }
}

module.exports = DetalleVenta;
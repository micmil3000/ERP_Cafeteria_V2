class DetalleCompra {
    constructor(id, compraId, productoProveedorId, cantidad, precioUnitario, subtotal) {
        this.id = id;
        this.compraId = compraId;
        this.productoProveedorId = productoProveedorId;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
    }
}

module.exports = DetalleCompra;
class Producto {
    constructor(id, nombre, categoria, precioVenta, stockActual, stockMinimo, descripcion, imagen, estado) {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precioVenta = precioVenta;
        this.stockActual = stockActual;
        this.stockMinimo = stockMinimo;
        this.descripcion = descripcion;
        this.imagen = imagen;
        this.estado = estado;
    }
}

module.exports = Producto;
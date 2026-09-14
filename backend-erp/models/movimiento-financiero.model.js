class MovimientoFinanciero {
    constructor(id, usuarioId, fechaHora, tipo, origen, referenciaOrigen, concepto, categoria, subtotal, iva, total, metodoPago, observaciones){
        this.id = id;
        this.usuarioId = usuarioId; 
        this.fechaHora = fechaHora;
        this.tipo = tipo;
        this.origen = origen;
        this.referenciaOrigen = referenciaOrigen;
        this.concepto = concepto;
        this.categoria = categoria;
        this.subtotal = subtotal;
        this.iva = iva;
        this.total = total;
        this.metodoPago = metodoPago;
        this.observaciones = observaciones;
    }
}

module.exports = MovimientoFinanciero;
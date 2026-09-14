class Factura {
    constructor(id, ventaId, folio, fechaEmision, rfc, nombreRazonSocial, codigoPostal, regimenFiscal, usoFactura, facturaXML) {
        this.id = id;
        this.ventaId = ventaId;
        this.folio = folio;
        this.fechaEmision = fechaEmision;
        this.rfc = rfc;
        this.nombreRazonSocial = nombreRazonSocial;
        this.codigoPostal = codigoPostal;
        this.regimenFiscal = regimenFiscal;
        this.usoFactura = usoFactura;
        this.facturaXML = facturaXML;
    }
}

module.exports = Factura;
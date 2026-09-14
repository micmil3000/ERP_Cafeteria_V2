export interface Factura {

    id : number;

    ventaId : number;

    folio : string;

    fechaEmision : string;

    rfc : string;

    nombreRazonSocial : string;

    codigoPostal : string;

    regimenFiscal : string;

    usoFactura : string;

    facturaXml : string | null;

}

export interface DatosFactura {

    ventaId : number;

    rfc : string;

    nombreRazonSocial : string;

    codigoPostal : string;

    regimenFiscal : string;

    usoFactura : string;

    facturaXml? : string;

}

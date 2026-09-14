export interface DetalleVenta {

    id : number;

    productoId : number;

    nombre : string;

    cantidad : number;

    precioUnitario : number;

    subtotal : number;

}

export interface Venta {

    id : number;

    numeroVenta : string;

    fechaHora : string;

    subtotal : number;

    iva : number;

    total : number;

    usuario : string;

    metodoPago? : string;

    detalles? : DetalleVenta[];

    facturada? : boolean;

    cantidadProductos? : number;

}

export interface ProductoVenta {
    id : number;
    nombre : string;
    categoria : string;
    precio : number;
    stock : number;
    stockMinimo : number;
    imagen : string;
}

export interface CarritoVenta {
    productId : number;
    nombre : string;
    precio : number;
    cantidad : number;
}

export interface VentaVista {
    id : number;
    fechaHora : string;
    items : CarritoVenta[];
    subtotal : number;
    iva : number;
    total : number;
    metodoPago : string;
    referencia? : string;
    usuario : string;
    factura? : {
        rfc : string;
        nombre : string;
        codigoPostal : string;
        regimen : string;
        uso : string;
        xml : string;
    };
}

export interface EstadoNavegacionVentas {
    products : ProductoVenta[];
    sales : VentaVista[];
    saleId? : number;
}

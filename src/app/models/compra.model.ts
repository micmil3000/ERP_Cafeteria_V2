export interface DetalleCompra {

    id : number;

    productoId : number;

    nombre : string;

    cantidad : number;

    precioCompra : number;

    subtotal : number;

}

export interface Compra {

    id : number;

    proveedorId : number;

    proveedorNombre : string;

    fechaHora : string;

    subtotal : number;

    iva : number;

    total : number;

    usuarioResponsable : string;

    detalles? : DetalleCompra[];

}

export interface NuevaCompra {

    proveedorId : number;

    usuarioId : number;

    metodoPago : string | null;

    detalles : {
        productoProveedorId : number;
        cantidad : number;
    }[];

}

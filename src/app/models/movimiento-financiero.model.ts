export interface MovimientoFinanciero {

    id : number;

    usuarioId : number;

    fechaHora : string;

    tipo : 'INGRESO' | 'GASTO';

    origen : 'VENTA' | 'COMPRA' | 'SALARIO' | 'MANUAL';

    referenciaOrigen : string | null;

    concepto : string;

    categoria : string;

    subtotal : number;

    iva : number;

    total : number;

    metodoPago : string | null;

    observaciones : string | null;

    usuario : string;

}

export interface FiltrosFinancieros {
    desde : string;
    hasta : string;
    tipo : string;
    categoria : string;
    origen : string;
}

export interface ResumenFinanciero {
    ingresos : number;
    gastos : number;
}

export interface GastoCategoria {
    categoria : string;
    total : number;
}

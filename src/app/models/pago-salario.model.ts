export interface PagoSalario {
    id : number;
    funcionarioId : number;
    trabajador : string;
    periodoInicio : string;
    periodoFin : string;
    fechaPago : string;
    monto : number;
    responsable : string;
}

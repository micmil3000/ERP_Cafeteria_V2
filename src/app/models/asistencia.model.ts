export interface Asistencia {
    id : number;
    funcionarioId : number;
    funcionario : string;
    fecha : string;
    horaEntrada : string | null;
    horaSalida : string | null;
    estado : 'PRESENTE' | 'RETARDO' | 'FALTA';
}

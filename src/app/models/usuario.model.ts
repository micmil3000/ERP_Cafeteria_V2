export interface Usuario {
    id : number;
    correo : string;
    rol : 'GERENTE' | 'TRABAJADOR';
    estado : 'ACTIVO' | 'INACTIVO';
    perfilId : number;
    nombre : string;
    apellidos : string;
}

export interface Login {
    correo : string;
    password : string;
}

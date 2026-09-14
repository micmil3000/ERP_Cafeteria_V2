export interface Funcionario {
    id : number;
    nombre : string;
    apellidos : string;
    rol : 'GERENTE' | 'TRABAJADOR';
    correo : string;
    telefono : string;
    fechaContratacion : string;
    salario : number;
    estado : 'ACTIVO' | 'INACTIVO';
}
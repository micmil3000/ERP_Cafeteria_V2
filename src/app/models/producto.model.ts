export interface Producto {
    id: number;
    nombre: string;
    categoria: string;
    precioVenta: number;
    stockActual: number;
    stockMinimo: number;
    descripcion: string;
    imagen: string | null;
    estado: 'ACTIVO' | 'INACTIVO';
}
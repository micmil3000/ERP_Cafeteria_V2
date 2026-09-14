import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

import { Proveedor } from "../models/proveedor.model";

import { ProductoProveedor } from "../models/producto-proveedor.model";

import { Respuesta } from "../models/respuesta.model";

export type ProductoProveedorDetalle = ProductoProveedor & {
    nombre : string;
    categoria : string;
    stockActual : number;
    stockMinimo : number;
};

@Injectable({
    providedIn: 'root'
})

export class ProveedorService {

    private api = "http://localhost:3000/api/proveedores";

    constructor(
        private http : HttpClient
    ) {}

    //Obtiene todos los proveedores
    obtenerProveedores() : Observable<Proveedor[]> {
        return this.http.get<Proveedor[]>(this.api);
    }
    //Registra un nuevo proveedor
    registrarProveedor(proveedor : Omit<Proveedor, 'id' | 'estado'>) : Observable<Respuesta> {
        return this.http.post<Respuesta>(this.api, proveedor);
    }
    //Edita un proveedor
    editarProveedor(id : number, proveedor : Omit<Proveedor, 'id' | 'estado'>) : Observable<Respuesta> {
        return this.http.put<Respuesta>(`${this.api}/${id}`, proveedor);
    }
    //Desactiva un proveedor
    desactivarProveedor(id : number) : Observable<Respuesta> {
        return this.http.put<Respuesta>(`${this.api}/${id}/desactivar`, {});
    }
    //Obtiene los productos asociados a un proveedor
    obtenerProductos(id : number) : Observable<ProductoProveedorDetalle[]> {
        return this.http.get<ProductoProveedorDetalle[]>(`${this.api}/${id}/productos`);
    }
    //Asocia un producto a un proveedor
    registrarProducto(id : number, producto : { productoId : number; precioCompra : number }) : Observable<Respuesta> {
        return this.http.post<Respuesta>(`${this.api}/${id}/productos`, producto);
    }
    //Actualiza el precio de un producto
    actualizarPrecio(id : number, relacionId : number, precioCompra : number) : Observable<Respuesta> {
        return this.http.put<Respuesta>(`${this.api}/${id}/productos/${relacionId}`, { precioCompra });
    }
    //Elimina la relación de un producto con el proveedor
    eliminarProducto(id : number, relacionId : number) : Observable<Respuesta> {
        return this.http.delete<Respuesta>(`${this.api}/${id}/productos/${relacionId}`);
    }
}

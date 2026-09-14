import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Producto } from "../models/producto.model";
import { Respuesta } from "../models/respuesta.model";

@Injectable({
    providedIn: 'root'
})

export class ProductoService {
    private api = "http://localhost:3000/api/productos";

    constructor(
        private http : HttpClient
    ){}

    obtenerProductos() : Observable<Producto[]> {
        return this.http.get<Producto[]>(this.api);
    }

    obtenerProductoPorID(id : number) : Observable<Producto> {
        return this.http.get<Producto>(`${this.api}/${id}`);
    }

    registrarProducto(producto : Omit<Producto, 'id' | 'estado'>) : Observable<Respuesta> {
        return this.http.post<Respuesta>(this.api, producto);
    }

    desactivarProducto(id : number) : Observable<Respuesta> {
        return this.http.put<Respuesta>(`${this.api}/${id}/desactivar`, {});
    }

    crearNuevaVersion(id : number, producto : Omit<Producto, 'id' | 'estado'>) : Observable<Respuesta> {
        return this.http.post<Respuesta>(`${this.api}/${id}/nueva-version`, producto);
    }
}

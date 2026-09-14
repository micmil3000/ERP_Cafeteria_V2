import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

import { Venta } from "../models/venta.model";

import { Respuesta } from "../models/respuesta.model";

export interface RespuestaVenta extends Respuesta {
    id : number;
    numeroVenta : string;
}

@Injectable({
    providedIn: 'root'
})

export class VentaService {

    private api = "http://localhost:3000/api/ventas";

    constructor(
        private http : HttpClient
    ) {}

    //Obtiene todas las ventas
    obtenerVentas() : Observable<Venta[]> {

        return this.http.get<Venta[]>(this.api);

    }

    //Obtiene una venta mediante su ID
    obtenerVenta(id : number) : Observable<Venta> {

        return this.http.get<Venta>(`${this.api}/${id}`);

    }

    //Registra una nueva venta
    registrarVenta(venta : {
        usuarioId : number;
        metodoPago : string;
        detalles : { productoId : number; cantidad : number }[];
    }) : Observable<RespuestaVenta> {

        return this.http.post<RespuestaVenta>(this.api, venta);

    }

}

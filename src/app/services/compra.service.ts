import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

import { Compra, NuevaCompra } from "../models/compra.model";

import { Respuesta } from "../models/respuesta.model";

@Injectable({
    providedIn: 'root'
})

export class CompraService {

    private api = "http://localhost:3000/api/compras";

    constructor(
        private http : HttpClient
    ) {}

    //Obtiene todas las compras
    obtenerCompras() : Observable<Compra[]> {

        return this.http.get<Compra[]>(this.api);

    }

    //Obtiene una compra mediante su ID
    obtenerCompraPorId(id : number) : Observable<Compra> {

        return this.http.get<Compra>(`${this.api}/${id}`);

    }

    //Registra una nueva compra
    registrarCompra(compra : NuevaCompra) : Observable<Respuesta> {

        return this.http.post<Respuesta>(this.api, compra);

    }

}

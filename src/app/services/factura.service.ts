import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

import { DatosFactura } from "../models/factura.model";

import { Respuesta } from "../models/respuesta.model";

@Injectable({
    providedIn: 'root'
})

export class FacturaService {

    private api = "http://localhost:3000/api/facturas";

    constructor(
        private http : HttpClient
    ) {}

    //Registra una factura
    registrar(factura : DatosFactura) : Observable<Respuesta> {

        return this.http.post<Respuesta>(this.api, factura);

    }

}

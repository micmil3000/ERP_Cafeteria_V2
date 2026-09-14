import { Injectable } from "@angular/core";

import { HttpClient, HttpParams } from "@angular/common/http";

import { Observable } from "rxjs";

import { FiltrosFinancieros, GastoCategoria, MovimientoFinanciero, ResumenFinanciero } from "../models/movimiento-financiero.model";

import { Respuesta } from "../models/respuesta.model";

@Injectable({
    providedIn: 'root'
})

export class FinanzaService {

    private api = "http://localhost:3000/api/movimientos-financieros";

    constructor(
        private http : HttpClient
    ) {}
    //Convierte los filtros en parámetros HTTP
    private obtenerParametros(filtros : FiltrosFinancieros) : HttpParams {
        let parametros = new HttpParams();
        Object.entries(filtros).forEach(([nombre, valor]) => {
            if(valor) {
                parametros = parametros.set(nombre, valor);
            }
        });
        return parametros;
    }
    //Obtiene los movimientos financieros
    obtenerMovimientos(filtros : FiltrosFinancieros) : Observable<MovimientoFinanciero[]> {
        return this.http.get<MovimientoFinanciero[]>(this.api, {
            params: this.obtenerParametros(filtros)
        });
    }
    //Obtiene el resumen financiero
    obtenerResumen(filtros : FiltrosFinancieros) : Observable<ResumenFinanciero> {
        return this.http.get<ResumenFinanciero>(`${this.api}/resumen`, {
            params: this.obtenerParametros(filtros)
        });
    }
    //Obtiene los gastos agrupados por categoría
    obtenerGastosCategoria(filtros : FiltrosFinancieros) : Observable<GastoCategoria[]> {
        return this.http.get<GastoCategoria[]>(`${this.api}/gastos-categoria`, {
            params: this.obtenerParametros(filtros)
        });
    }
    //Registra un gasto manual
    registrarGasto(gasto : object) : Observable<Respuesta> {
        return this.http.post<Respuesta>(this.api, gasto);
    }
}

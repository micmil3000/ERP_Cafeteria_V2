import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

import { Funcionario } from "../models/funcionario.model";

import { Horario } from "../models/horario.model";

import { Asistencia } from "../models/asistencia.model";

import { PagoSalario } from "../models/pago-salario.model";

@Injectable({
    providedIn: 'root'
})

export class FuncionarioService {

    private api = "http://localhost:3000/api/funcionarios";

    constructor(
        private http : HttpClient
    ) {}
    //Obtiene todos los funcionarios
    obtenerFuncionarios() : Observable<Funcionario[]> {
        return this.http.get<Funcionario[]>(this.api);
    }
    //Obtiene un funcionario mediante su ID
    obtenerFuncionarioPorId(id : number) : Observable<Funcionario> {
        return this.http.get<Funcionario>(`${this.api}/${id}`);
    }
    //Obtiene el horario de un funcionario
    obtenerHorario(id : number) : Observable<Horario[]> {
        return this.http.get<Horario[]>(`${this.api}/${id}/horario`);
    }
    //Obtiene todas las asistencias
    obtenerAsistencias() : Observable<Asistencia[]> {
        return this.http.get<Asistencia[]>('http://localhost:3000/api/asistencias');
    }
    //Obtiene las asistencias de un funcionario
    obtenerAsistenciasPorFuncionario(id : number) : Observable<Asistencia[]> {
        return this.http.get<Asistencia[]>(`${this.api}/${id}/asistencias`);
    }
    //Obtiene todos los pagos de salario
    obtenerPagos() : Observable<PagoSalario[]> {
        return this.http.get<PagoSalario[]>('http://localhost:3000/api/pagos');
    }
    //Obtiene los pagos de un funcionario
    obtenerPagosPorFuncionario(id : number) : Observable<PagoSalario[]> {
        return this.http.get<PagoSalario[]>(`${this.api}/${id}/pagos`);
    }
}

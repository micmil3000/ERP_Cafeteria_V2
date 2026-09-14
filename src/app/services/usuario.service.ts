import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

import { Login, Usuario } from "../models/usuario.model";

@Injectable({
    providedIn: 'root'
})

export class UsuarioService {

    private api = "http://localhost:3000/api/usuarios";

    constructor(
        private http : HttpClient
    ) {}

    //Inicia sesión con correo y contraseña
    login(datos : Login) : Observable<Usuario> {

        return this.http.post<Usuario>(`${this.api}/login`, datos);

    }

}

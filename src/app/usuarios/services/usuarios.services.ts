import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Usuario } from "../types/usuario.interface";

@Injectable({
  providedIn: 'root'
})

export class UsuariosService {

  private url = 'http://localhost:3000/usuarios/';

  constructor(private httpClient: HttpClient) { }

  getUsuario(id: number): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.url}${id}`);
  }
}
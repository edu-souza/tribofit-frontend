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

  getUsuario(): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(`${this.url}`);
  }

  getUsuarioById(id: string): Observable<Usuario | undefined> {
    return this.httpClient.get<Usuario | undefined>(`${this.url}${id}`);
  }

  excluir(id: string): Observable<Object> {
    return this.httpClient.delete(`${this.url}${id}`);
  }

  private addUsuario(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.post<Usuario>(this.url, usuario);
  }

  private updUsuario(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.put<Usuario>(`${this.url}${usuario.id}`, usuario);
  }

  salvar(usuario: Usuario): Observable<any> {
    const id = usuario.id; // Acesse a propriedade id diretamente
    if (id) {
      // Se o ID está presente, é uma atualização
      return this.updUsuario(usuario);
    } else {
      // Caso contrário, é uma criação
      return this.addUsuario(usuario);
    }
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('foto', file);
  
    return this.httpClient.post('http://localhost:3000/usuarios/upload', formData);
  }
}
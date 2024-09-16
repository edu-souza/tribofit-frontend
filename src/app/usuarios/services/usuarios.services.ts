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

  getImagem(filename: string): Observable<Blob>{
    return this.httpClient.get(`${this.url}imagem/${filename}`, {responseType: 'blob'})
  }

  excluir(id: string): Observable<Object> {
    return this.httpClient.delete(`${this.url}${id}`);
  }

  private addUsuario(formData: FormData): Observable<Usuario> {
    return this.httpClient.post<Usuario>(this.url, formData);
  }

  private updUsuario(formData: FormData): Observable<Usuario> {
    const id = formData.get('id') as string;
    return this.httpClient.put<Usuario>(`${this.url}${id}`, formData);
  }

  salvar(usuario: FormData): Observable<any> {
    // Verifique se é uma criação ou atualização
    const id = usuario.get('id') as string;
    if (id) {
      // Atualização
      return this.updUsuario(usuario);
    } else {
      // Criação
      return this.addUsuario(usuario);
    }
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('foto', file);
  
    return this.httpClient.post('http://localhost:3000/usuarios/upload', formData);
  }
}
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  private baseUrl = 'http://localhost:3000/auth'; // URL base da sua API

  constructor(private http: HttpClient) { }

  // Método para fazer login
  signIn(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { username, password });
  }

  // Método para obter o perfil do usuário
  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/profile`);
  }
}
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  // Método para fazer login
  signIn(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { username, password });
  }

  // Método para obter o perfil do usuário
  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/profile`);
  }

  // Método para enviar o email de recuperação de senha
   forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/esqueceu-senha`, { email });
  }

  validateResetCode( code: string) {
    return this.http.post(`${this.baseUrl}/validar-reset-code`, { code });
  }
  
  resetPassword(code: string | null, newPassword: string) {
    return this.http.post(`${this.baseUrl}/atualizar-senha`, { code, newPassword });
  }
}
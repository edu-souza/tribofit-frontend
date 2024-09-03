import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  usuarioLogado : String = '';
  private refreshTokenKey = 'refreshToken';
  private baseUrl = 'http://localhost:3000/auth';
  

  constructor(private http: HttpClient) {}

  public saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  public logout(): void {
    this.removeToken();
    this.removeRefreshToken();
  }

  public removeRefreshToken(): void {
    console.log('Removendo refresh token.');
    localStorage.removeItem(this.refreshTokenKey);
  }

  public refreshToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();
    console.log('Enviando refresh token para renovação:', refreshToken);
    return this.http.post<{ access_token: string }>(`${this.baseUrl}/refresh`, { refresh_token: refreshToken })
      .pipe(map(response => {
        console.log('Resposta de renovação de token:', response);
        return response.access_token;
      }));
  }

  public saveRefreshToken(refreshToken: string): void {
    console.log('Salvando refresh token:', refreshToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  public getRefreshToken(): string | null {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);
    console.log('Obtendo refresh token:', refreshToken);
    return refreshToken;
  }

  getUsuarioLogado() {
    const token = this.getToken();
    if (token) {
      this.usuarioLogado = jwtDecode(token);
      console.log('Usuário logado:', this.usuarioLogado);
    }
    return this.usuarioLogado
  }

}
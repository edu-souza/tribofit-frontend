import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  usuarioLogado : String = '';

  constructor() {}

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
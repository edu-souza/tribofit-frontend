import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { UsuariosService } from '../usuarios/services/usuarios.services';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  usuarioLogado : String = '';
  private refreshTokenKey = 'refreshToken';
  private baseUrl = `${environment.apiUrl}/auth`;
  
  private usuarioLogadoSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient,
    private usuarioService: UsuariosService
  ) {}

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

  public getUsuarioLogadoObservable() {
    return this.usuarioLogadoSubject.asObservable();
  }

  public setUsuarioLogado(usuario: any) {
    this.usuarioLogadoSubject.next(usuario);
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
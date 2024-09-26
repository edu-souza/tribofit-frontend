import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Notificacao } from "../types/notificacao.interface";

@Injectable({
  providedIn: 'root'
})
export class NotificacoesService {

  private url = 'http://localhost:3000/notificacoes/';

  constructor(private httpClient: HttpClient) { }

  getNotificacao(): Observable<Notificacao[]> {
    return this.httpClient.get<Notificacao[]>(`${this.url}`);
  }

  getNotificacaoById(id: string): Observable<Notificacao | undefined> {
    return this.httpClient.get<Notificacao | undefined>(`${this.url}${id}`);
  }

  getNotificacaoByUser(userId: string): Observable<Notificacao[] | undefined> {
    return this.httpClient.get<Notificacao[] | undefined>(`${this.url}usuario/${userId}`);
  }

  marcarLido(notificacaoId: string): Observable<any> {
    return this.httpClient.put(`${this.url}${notificacaoId}/marcar-como-lida`,{})
  }

  excluir(id: string): Observable<Object> {
    return this.httpClient.delete(`${this.url}${id}`);
  }

  private addNotificacao(notificacao: Notificacao): Observable<Notificacao> {
    return this.httpClient.post<Notificacao>(this.url, notificacao);
  }

  private updNotificacao(notificacao: Notificacao): Observable<Notificacao> {
    const id = notificacao.id;
    return this.httpClient.put<Notificacao>(`${this.url}${id}`, notificacao);
  }

  salvar(notificacao: Notificacao): Observable<any> {
    // Verifique se é uma criação ou atualização
    const id = notificacao.id
    if (id) {
      // Atualização
      return this.updNotificacao(notificacao);
    } else {
      // Criação
      return this.addNotificacao(notificacao);
    }
  }
}
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Evento } from "../types/evento.interface";
import { EventoUsuario } from "../types/evento_usuario.interface";

@Injectable({
  providedIn: 'root'
})

export class EventoService {

  private url = 'http://localhost:3000/eventos';

  constructor(private httpClient: HttpClient) { }

  getEventos(): Observable<Evento[]> {
    return this.httpClient.get<Evento[]>(`${this.url}`);
  }

  getEventosAprov(): Observable<Evento[]> {
    return this.httpClient.get<Evento[]>(`${this.url}/aprovados`);
  }

  getMeusEventos(userId: string): Observable<Evento[]> {
    const params = new HttpParams().set('userId', userId);
    return this.httpClient.get<Evento[]>(`${this.url}/meus-eventos`, { params });
  }

  getSolicitacoesPendentes(userId: string): Observable<Evento[]> {
    const params = new HttpParams().set('userId', userId);
    return this.httpClient.get<Evento[]>(`${this.url}/solicitacoes-pendentes`, { params });
  }

  updateEventoUsuarios(evento: Evento): Observable<Evento>  {
    console.log('passou aqui service');
    return this.httpClient.put<Evento>(`${this.url}/${evento.id}/usuarios`, evento);
  }

  getCountEventosPend(): Observable<number> {
    return this.httpClient.get<number>(`${this.url}/pendentes`);
  }

  getEventoById(id: string): Observable<Evento | undefined> {
    return this.httpClient.get<Evento | undefined>(`${this.url}/${id}`);
  }

  excluir(id: string): Observable<Object> {
    return this.httpClient.delete(`${this.url}/${id}`);
  }

  addEvento(evento: Evento): Observable<Evento> {
    return this.httpClient.post<Evento>(this.url, evento);
  }

  updEvento(evento: Evento): Observable<Evento> {
    return this.httpClient.put<Evento>(`${this.url}/${evento.id}`, evento);
  }

  salvar(evento: Evento): Observable<Evento> {
    if (evento.id) {
      return this.updEvento(evento);
    } else {
      console.log('addEvento-service')
      console.log(evento)
      return this.addEvento(evento);
    }
  }

  updateStatusAprovacao(id: string, status: string): Observable<Evento> {
    return this.httpClient.put<Evento>(`${this.url}/${id}/status-aprovacao`, { status });
  }

  updateStatusAprovacaoParticipante(idEventoUsuario: string, status: string): Observable<EventoUsuario> {
    console.log('teste 4');
    return this.httpClient.put<EventoUsuario>(`${this.url}/${idEventoUsuario}/status-aprovacao-participante`, { status });
  }

  updateStatus(id: string, status: string): Observable<Evento> {
    return this.httpClient.put<Evento>(`${this.url}/${id}/status`, { status });
  }
  
}
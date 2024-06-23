import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Evento } from "../types/evento.interface";

@Injectable({
  providedIn: 'root'
})

export class EventoService {

  private url = 'http://localhost:3000/eventos';

  constructor(private httpClient: HttpClient) { }

  getEventos(): Observable<Evento[]> {
    return this.httpClient.get<Evento[]>(`${this.url}`);
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
}
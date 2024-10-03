import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Modalidade } from "../types/modalidade.interface";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})

export class ModalidadesService {

  private url = `${environment.apiUrl}/modalidades`;

  constructor(private httpClient: HttpClient) { }

  getModalidade(): Observable<Modalidade[]> {
    return this.httpClient.get<Modalidade[]>(this.url);
  }

  getModalidadeById(id: string): Observable<Modalidade | undefined> {
    return this.httpClient.get<Modalidade | undefined>(`${this.url}${id}`);
  }

  excluir(id: string): Observable<Object> {
    console.log(`${this.url}${id}`)
    return this.httpClient.delete(`${this.url}${id}`);
  }

  private addModalidade(modalidade: Modalidade): Observable<Modalidade> {
    return this.httpClient.post<Modalidade>(this.url, modalidade);
  }

  private updModalidade(modalidade: Modalidade): Observable<Modalidade> {
    return this.httpClient.put<Modalidade>(`${this.url}${modalidade.id}`, modalidade);
  }

  salvar(modalidade: Modalidade): Observable<Modalidade> {
    if (modalidade.id) {
      return this.updModalidade(modalidade);
    } else {
      return this.addModalidade(modalidade);
    }
  }
}
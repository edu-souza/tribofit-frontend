import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Cidade } from "./cidade.interface";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})

export class CidadesService {

  private url = `${environment.apiUrl}/cidades/`;

  constructor(private httpClient: HttpClient) { }

  getCidade(): Observable<Cidade[]> {
    return this.httpClient.get<Cidade[]>(`${this.url}`);
  }

  getCidadeById(id: string): Observable<Cidade | undefined> {
    return this.httpClient.get<Cidade | undefined>(`${this.url}${id}`);
  }

}
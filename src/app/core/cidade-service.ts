import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Cidade } from "./cidade.interface";

@Injectable({
  providedIn: 'root'
})

export class CidadesService {

  private url = 'http://localhost:3000/cidades/';

  constructor(private httpClient: HttpClient) { }

  getCidade(): Observable<Cidade[]> {
    //console.log(`${this.url}`)
    return this.httpClient.get<Cidade[]>(`${this.url}`);
  }

  getCidadeById(id: string): Observable<Cidade | undefined> {
    return this.httpClient.get<Cidade | undefined>(`${this.url}${id}`);
  }

}
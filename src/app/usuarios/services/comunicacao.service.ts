import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComunicacaoService {
  private imagemAtualizadaSource = new BehaviorSubject<string | null>(null);
  imagemAtualizada$ = this.imagemAtualizadaSource.asObservable();

  emitirAtualizacaoImagem(novaImagem: string) {
    this.imagemAtualizadaSource.next(novaImagem);
  }
}
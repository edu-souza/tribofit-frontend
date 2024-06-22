import { Component } from '@angular/core';
import { Evento } from '../types/evento.interface';
import { EventoService } from '../services/evento.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'lista-evento',
  templateUrl: './lista-evento.component.html',
  styleUrls: ['lista-evento.component.css']
})
export class ListaEventoComponent {

  eventos: Evento[] = [];

  constructor(private eventoService: EventoService,
    private alertController: AlertController,
    private toastController: ToastController) { }

  ngOnInit() {
    this.listaEventos()
  }

  listaEventos() {
    const observable = this.eventoService.getEventos();
    observable.subscribe(
      (dados) => {
        this.eventos = dados;
      },
      (erro) => {
        console.error(erro);
        this.toastController
          .create({
            message: `Erro ao listar registros`,
            duration: 5000,
            keyboardClose: true,
            color: 'danger',
          })
          .then((t) => t.present());
      }
    );
  }
}

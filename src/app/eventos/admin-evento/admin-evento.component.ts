import { Component, OnInit } from '@angular/core';
import { Evento } from '../types/evento.interface';
import { EventoService } from '../services/evento.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-evento',
  templateUrl: './admin-evento.component.html',
  styleUrls: ['./admin-evento.component.scss'],
})
export class AdminEventoComponent  implements OnInit {

  private subscriptions = new Subscription

  eventos: Evento[] = [];
  chipColor : string = ''
  chipText  : string = ''

  constructor(private eventoService: EventoService,
    private alertController: AlertController,
    private toastController: ToastController) { }

  ngOnInit() {
    this.listaEventos()
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ionViewWillEnter() {
    this.listaEventos()
  }


  confirmarExclusao(evento: Evento) {
    this.alertController.create({
      header: 'Confirmação de exclusão',
      message: `Deseja excluir o evento ${evento.titulo}?`,
      buttons: [
        {
          text: 'Sim',
          handler: () => this.excluir(evento),
        },
        {
          text: 'Não',
        },
      ],
    }).then((alerta) => alerta.present());
  }

  private excluir(evento: Evento) {
    if (evento.id) {
      this.eventoService.excluir(evento.id).subscribe(
        () => this.listaEventos(),
        (erro) => {
          this.toastController.create({
            position: 'top',
            duration: 3000,
            color: 'danger',
          })
        }
      );
    }
  }

  listaEventos() {
    this.subscriptions.add(
      this.eventoService.getEventos().subscribe(
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
      )
    )
  }

  getChipColor(status: string): string {
    switch (status) {
      case 'A':
        return 'success';
      case 'R':
        return 'danger';
      case 'P':
        return 'warning';
      default:
        return 'medium';
    }
  }

  getChipText(status: string): string {
    switch (status) {
      case 'A':
        return 'Aprovado';
      case 'R':
        return 'Rejeitado';
      case 'P':
        return 'Pendente';
      default:
        return 'Desconhecido';
    }
  }


}

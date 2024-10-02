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
  aprovarEvento(evento: Evento) {
    const id = evento.id || '';
  
    if (evento.status_aprov === 'A') {
      this.toastController.create({
        message: `O evento ${evento.titulo} já está aprovado.`,
        duration: 3000,
        color: 'warning',
      }).then((toast) => toast.present());
      return;
    }
  
    if (evento.status_aprov === 'R') {
      this.toastController.create({
        message: `O evento ${evento.titulo} foi reprovado anteriormente. Não é possível aprovar agora.`,
        duration: 3000,
        color: 'warning',
      }).then((toast) => toast.present());
      return;
    }
  
    // Confirmação antes de aprovar
    this.alertController.create({
      header: 'Confirmação de Aprovação',
      message: `Deseja aprovar o evento ${evento.titulo}?`,
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.eventoService.updateStatusAprovacao(id, 'A').subscribe(
              () => {
                this.toastController.create({
                  message: `Evento ${evento.titulo} aprovado com sucesso!`,
                  duration: 3000,
                  color: 'success',
                }).then((toast) => toast.present());
                this.listaEventos();
              },
              (_erro: any) => {
                this.toastController.create({
                  message: `Erro ao aprovar o evento ${evento.titulo}.`,
                  duration: 3000,
                  color: 'danger',
                }).then((toast) => toast.present());
              }
            );
          }
        },
        {
          text: 'Não',
        }
      ]
    }).then((alert) => alert.present());
  }
  
  reprovarEvento(evento: Evento) {
    const id = evento.id || '';
  
    if (evento.status_aprov === 'R') {
      this.toastController.create({
        message: `O evento ${evento.titulo} já está reprovado.`,
        duration: 3000,
        color: 'warning',
      }).then((toast) => toast.present());
      return;
    }
  
    if (evento.status_aprov === 'A') {
      this.toastController.create({
        message: `O evento ${evento.titulo} foi aprovado anteriormente. Não é possível reprovar agora.`,
        duration: 3000,
        color: 'warning',
      }).then((toast) => toast.present());
      return;
    }
  
    // Confirmação antes de reprovar
    this.alertController.create({
      header: 'Confirmação de Reprovação',
      message: `Deseja reprovar o evento ${evento.titulo}?`,
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.eventoService.updateStatusAprovacao(id, 'R').subscribe(
              () => {
                this.toastController.create({
                  message: `Evento ${evento.titulo} reprovado com sucesso!`,
                  duration: 3000,
                  color: 'warning',
                }).then((toast) => toast.present());
                this.listaEventos();
              },
              (_erro: any) => {
                this.toastController.create({
                  message: `Erro ao reprovar o evento ${evento.titulo}.`,
                  duration: 3000,
                  color: 'danger',
                }).then((toast) => toast.present());
              }
            );
          }
        },
        {
          text: 'Não',
        }
      ]
    }).then((alert) => alert.present());
  }
}

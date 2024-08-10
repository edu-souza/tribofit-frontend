import { Component, OnDestroy, OnInit } from '@angular/core';
import { Evento } from '../types/evento.interface';
import { EventoService } from '../services/evento.service';
import { AlertController, ToastController, ViewWillEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lista-eventos',
  templateUrl: './lista-evento.component.html',
  styleUrls: ['lista-evento.component.css']
})
export class ListaEventoComponent implements OnInit, OnDestroy, ViewWillEnter {
  private subscriptions = new Subscription

  eventos: Evento[] = [];
  public menus = [
    { title: 'Solicitações pendentes', url: '/eventos', icon: 'person-add' },
    { title: 'Configurações', url: '/eventos', icon: 'cog' },
    { title: 'Usuários(Admin)', url: '/tabs/usuarios', icon: 'people' },
    { title: 'Modalidades(Admin)', url: '/tabs/modalidades', icon: 'star' },
    { title: 'Eventos(Admin)', url: '/tabs/eventos', icon: 'grid' },
  ];

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
}

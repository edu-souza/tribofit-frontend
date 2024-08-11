import { Component, OnDestroy, OnInit } from '@angular/core';
import { Evento } from '../types/evento.interface';
import { EventoService } from '../services/evento.service';
import { AlertController, ToastController, ViewWillEnter } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { menus } from 'src/app/core/menu/menus';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'lista-eventos',
  templateUrl: './lista-evento.component.html',
  styleUrls: ['lista-evento.component.css']
})
export class ListaEventoComponent implements OnInit, OnDestroy, ViewWillEnter {
  private subscriptions = new Subscription();
  eventos: Evento[] = [];
  menus = menus;
  tipo: string = '';
  title: string = '';
  content: string = '';

  constructor(
    private eventoService: EventoService,
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastController: ToastController
  ) {
    this.setupRouteListener();
  }

  ngOnInit() {
    this.listaEventos();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ionViewWillEnter() {
    this.listaEventos();
  }

  private setupRouteListener() {
    this.subscriptions.add(
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
        const currentUrl = this.router.url;
        if (currentUrl.includes('participando')) {
          this.tipo = 'P';
          this.content = 'participando'
        } else if (currentUrl.includes('eventos')) {
          this.tipo = 'E';
          this.content = 'evento'
        }
        this.title = this.tipo === 'P' ? 'Participando' : 'Eventos';
      })
    );
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
          }).then((t) => t.present());
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
    );
  }
}

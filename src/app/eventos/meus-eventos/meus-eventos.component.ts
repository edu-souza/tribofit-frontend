import { Component, OnInit, OnDestroy } from '@angular/core';
import { Evento } from '../types/evento.interface';
import { Subscription } from 'rxjs';
import { EventoService } from '../services/evento.service';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/authentication/auth.service';

@Component({
  selector: 'app-meus-eventos',
  templateUrl: './meus-eventos.component.html',
  styleUrls: ['./meus-eventos.component.scss'],
})
export class MeusEventosComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  eventos: Evento[] = [];
  eventosOriginal: Evento[] = [];
  usuarioLogado: any;
  isAdmin: boolean = false;
  filtrosAtivos: Set<string> = new Set();

  constructor(
    private eventoService: EventoService,
    private toastController: ToastController,
    private authService: AuthService
  ) {
    this.usuarioLogado = this.authService.getUsuarioLogado();
    this.isAdmin = this.usuarioLogado.acesso === 'admin';
  }

  ngOnInit() {
    this.listaMeusEventos();
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.listaMeusEventos();
      event.target.complete();
    }, 2000);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  listaMeusEventos() {
    this.subscriptions.add(
      this.eventoService.getMeusEventos(this.usuarioLogado.sub).subscribe(
        (dados) => {
          this.eventos = dados;
          this.eventosOriginal = [...dados];
        },
        (erro) => {
          console.error(erro);
          this.toastController
            .create({
              message: 'Erro ao listar registros',
              duration: 5000,
              keyboardClose: true,
              color: 'danger',
            })
            .then((t) => t.present());
        }
      )
    );
  }

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    if (query) {
      this.eventos = this.eventosOriginal.filter((e) => e.titulo.toLowerCase().includes(query));
    } else {
      this.applyFilters();
    }
  }

  toggleFilter(filter: string) {
    this.filtrosAtivos.clear(); 
    this.filtrosAtivos.add(filter);
    this.applyFilters();
  }

  isFilterActive(filter: string): boolean {
    return this.filtrosAtivos.has(filter);
  }

  applyFilters() {
    let eventosFiltrados = [...this.eventosOriginal];
  
    if (this.filtrosAtivos.has('anfitriao')) {
      eventosFiltrados = eventosFiltrados.filter(e => e.admin === this.usuarioLogado.sub);
    }
    if (this.filtrosAtivos.has('participando')) {
      eventosFiltrados = eventosFiltrados.filter(e => 
        e.eventosUsuarios.some(evento => 
          evento.usuario.id === this.usuarioLogado.sub && evento.statusParticipante === 'A'
        )
      );
    }
    if (this.filtrosAtivos.has('pendente')) {
      eventosFiltrados = eventosFiltrados.filter(e => 
        e.eventosUsuarios.some(evento => 
          evento.usuario.id === this.usuarioLogado.sub && evento.statusParticipante === 'P'
        )
      );
    }
  
    if (this.filtrosAtivos.has('reprovado')) {
      eventosFiltrados = eventosFiltrados.filter(e => 
        e.eventosUsuarios.some(evento => 
          evento.usuario.id === this.usuarioLogado.sub && evento.statusParticipante === 'R'
        )
      );
    }
  
    this.eventos = eventosFiltrados;
  }

  clearFilters() {
    this.filtrosAtivos.clear();
    this.eventos = [...this.eventosOriginal];
  }
}

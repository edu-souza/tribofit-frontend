import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/authentication/auth.service';
import { EventoService } from '../services/evento.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-solicitacoes-pendentes',
  templateUrl: './solicitacoes-pendentes.component.html',
  styleUrls: ['./solicitacoes-pendentes.component.scss'],
})
export class SolicitacoesPendentesComponent  implements OnInit {
  usuarioLogado: any;
  isAdmin: boolean = false;
  solicitacoes: any[] = [];
  private subscriptions = new Subscription();

  constructor(private eventoService: EventoService,
    private toastController: ToastController,
    private authService: AuthService) {
      this.usuarioLogado = this.authService.getUsuarioLogado();
      this.isAdmin = this.usuarioLogado.acesso === 'admin';
    }

  ngOnInit() {
    this.listaSolicitacoes();
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.listaSolicitacoes();
      event.target.complete();
    }, 2000);
  }

  listaSolicitacoes() {
    this.subscriptions.add(
      this.eventoService.getSolicitacoesPendentes(this.usuarioLogado.sub).subscribe(
        (dados) => {
          this.solicitacoes = dados;
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

}

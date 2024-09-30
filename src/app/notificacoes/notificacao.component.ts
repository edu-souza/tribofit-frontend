import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../authentication/auth.service';
import { NotificacoesService } from './services/notificacao.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { UsuariosService } from '../usuarios/services/usuarios.services';
import { Usuario } from '../usuarios/types/usuario.interface';
import { Notificacao } from './types/notificacao.interface';
import { menus } from '../core/menu/menus';

@Component({
  selector: 'notificacao',
  templateUrl: './notificacao.component.html',
  styleUrls: ['./notificacao.component.scss'],
})
export class NotificacaoComponent implements OnInit, OnDestroy {
  qtdEventosPend : number = 0;
  usuario: Usuario | null | undefined = undefined;
  private subscriptions = new Subscription();
  notificacoes: any[] = [];
  menus = menus;

  constructor(
    private toastController: ToastController,
    private authService: AuthService,
    private notificacaoService: NotificacoesService,
    private usuarioService: UsuariosService,
    private activatedRoute: ActivatedRoute
  ) {}

  async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: 'success',
    });

    await toast.present();
  }

  async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: 'danger',
    });

    await toast.present();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.activatedRoute.params.subscribe(() => {
        const token = this.authService.getToken();
        if (token) {
          const userData = jwtDecode(token);
          if (userData && userData.sub) {
            this.usuarioService.getUsuarioById(userData.sub).subscribe(
              (response) => {
                this.usuario = response; 
                if (this.usuario?.id) {
                  this.notificacaoService.getNotificacaoByUser(this.usuario.id).subscribe(
                    (response) => {
                      this.notificacoes = (response || []).sort(
                        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
                      );
                      console.log(this.notificacoes);
                    },
                    (error) => {
                      console.error('Erro ao carregar dados das notificações:', error);
                      this.showErrorToast('Erro ao carregar dados das notificações.');
                    }
                  );
                } else {
                  console.warn('ID do usuário é indefinido');
                }
              },
              (error) => {
                console.error('Erro ao carregar dados do usuário:', error);
                this.showErrorToast('Erro ao carregar dados do usuário.');
              }
            );
          } else {
            console.warn('Id do usuário não encontrado no token.');
          }
        } else {
          console.warn('Token é nulo');
        }
      })
    );
  }

  ngOnDestroy(): void {}

  marcarLido(notificacao: Notificacao): void{
    if (!notificacao.lido) {
      notificacao.lido = true;
      if (notificacao.id)
      this.notificacaoService.marcarLido(notificacao.id).subscribe(
        () => {
          this.showSuccessToast('Notificação marcada como lida');
        },
        (error) => {
          this.showErrorToast('Erro ao marcar notificação como lida');
        }
      )
    }
  }
}

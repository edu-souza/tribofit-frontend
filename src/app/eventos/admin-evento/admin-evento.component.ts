import { Component, OnInit } from '@angular/core';
import { Evento } from '../types/evento.interface';
import { EventoService } from '../services/evento.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Notificacao } from 'src/app/notificacoes/types/notificacao.interface';
import { NotificacoesService } from 'src/app/notificacoes/services/notificacao.service';
import { UsuariosService } from 'src/app/usuarios/services/usuarios.services';

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
    private toastController: ToastController,
    private notificacaoService: NotificacoesService,
    private usuarioService: UsuariosService
  ) { }

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
            // Atualiza o status do evento para 'Aprovado'
            this.eventoService.updateStatus(id, 'A').subscribe(
              () => {
                // Exibe toast de sucesso
                this.toastController.create({
                  message: `Evento ${evento.titulo} aprovado com sucesso!`,
                  duration: 3000,
                  color: 'success',
                }).then((toast) => toast.present());
  
                // Obtenção do usuário e criação da notificação após o status ser atualizado
                this.usuarioService.getUsuarioById(evento.admin).subscribe(
                  (responseUsuario) => {
                    if (responseUsuario) { // Verificação se o usuário não é undefined
                      const notificacao: Notificacao = {
                        descricao: `Seu evento "${evento.titulo}" foi aprovado!`,
                        tipo: 'accept',
                        data: new Date(),
                        lido: false,
                        usuario: responseUsuario // Associa o usuário retornado à notificação
                      };
                
                      // Salvar a notificação
                      this.notificacaoService.salvar(notificacao).subscribe({
                        next: (response) => {
                          console.log('Notificação salva com sucesso', response);
                          this.toastController.create({
                            message: 'Notificação enviada ao administrador.',
                            duration: 3000,
                            color: 'success',
                          }).then((toast) => toast.present());
                        },
                        error: (error) => {
                          console.error('Erro ao salvar notificação', error);
                          this.toastController.create({
                            message: 'Erro ao enviar a notificação.',
                            duration: 3000,
                            color: 'danger',
                          }).then((toast) => toast.present());
                        }
                      });
                    } else {
                      console.error('Usuário não encontrado');
                      this.toastController.create({
                        message: 'Erro: Usuário não encontrado.',
                        duration: 3000,
                        color: 'danger',
                      }).then((toast) => toast.present());
                    }
                  },
                  (error) => {
                    console.error('Erro ao obter dados do usuário', error);
                    this.toastController.create({
                      message: 'Erro ao obter dados do administrador.',
                      duration: 3000,
                      color: 'danger',
                    }).then((toast) => toast.present());
                  }
                );
  
                // Atualiza a lista de eventos após a aprovação
                this.listaEventos();
              },
              (_erro: any) => {
                // Exibe toast de erro se a aprovação falhar
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
            this.eventoService.updateStatus(id, 'R').subscribe(
              () => {
                this.toastController.create({
                  message: `Evento ${evento.titulo} reprovado com sucesso!`,
                  duration: 3000,
                  color: 'warning',
                }).then((toast) => toast.present());

                // Obtenção do usuário e criação da notificação após o status ser atualizado
                this.usuarioService.getUsuarioById(evento.admin).subscribe(
                  (responseUsuario) => {
                    if (responseUsuario) { // Verificação se o usuário não é undefined
                      const notificacao: Notificacao = {
                        descricao: `Seu evento "${evento.titulo}" foi reprovado!`,
                        tipo: 'denied',
                        data: new Date(),
                        lido: false,
                        usuario: responseUsuario // Associa o usuário retornado à notificação
                      };
                
                      // Salvar a notificação
                      this.notificacaoService.salvar(notificacao).subscribe({
                        next: (response) => {
                          console.log('Notificação salva com sucesso', response);
                          this.toastController.create({
                            message: 'Notificação enviada ao administrador.',
                            duration: 3000,
                            color: 'success',
                          }).then((toast) => toast.present());
                        },
                        error: (error) => {
                          console.error('Erro ao salvar notificação', error);
                          this.toastController.create({
                            message: 'Erro ao enviar a notificação.',
                            duration: 3000,
                            color: 'danger',
                          }).then((toast) => toast.present());
                        }
                      });
                    } else {
                      console.error('Usuário não encontrado');
                      this.toastController.create({
                        message: 'Erro: Usuário não encontrado.',
                        duration: 3000,
                        color: 'danger',
                      }).then((toast) => toast.present());
                    }
                  },
                  (error) => {
                    console.error('Erro ao obter dados do usuário', error);
                    this.toastController.create({
                      message: 'Erro ao obter dados do administrador.',
                      duration: 3000,
                      color: 'danger',
                    }).then((toast) => toast.present());
                  }
                );

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

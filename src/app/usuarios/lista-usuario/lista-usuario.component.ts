import { Component, OnDestroy, OnInit } from "@angular/core";
import { UsuariosService } from "../services/usuarios.services";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Usuario } from "../types/usuario.interface";
import { AlertController, ToastController } from "@ionic/angular";

@Component({
  selector: 'lista-usuario',
  templateUrl: './lista-usuario.component.html',
  styleUrls: ['./lista-usuario.component.css']
})

export class ListaUsuarioComponent implements OnInit, OnDestroy {
  usuarios: Usuario[] = [];
  private subscriptions = new Subscription();

  constructor(private usuarioService: UsuariosService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.usuarioService.getUsuario().subscribe(
        (response) => {
          this.usuarios = response;
        },
        (erro) => {
          console.error('Error occurred:', erro);
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ionViewWillEnter(): void {
    this.listar();
  }

  confirmarExclusao(usuario: Usuario) {
    this.alertController.create({
        header: 'Confirmação de exclusão',
        message: `Deseja excluir o usuário ${usuario.nome}?`,
        buttons: [
          {
            text: 'Sim',
            handler: () => this.excluir(usuario),
          },
          {
            text: 'Não',
          },
        ],
      })
      .then((alerta) => alerta.present());
  }

  private excluir(usuario: Usuario) {
    if (usuario.id) {
      this.usuarioService.excluir(usuario.id).subscribe(
        () => this.listar(),
        (erro) => {
          this.toastController.create({
              message: 'Erro ao excluir usuário',
              position: 'top',
              duration: 5000,
              color: 'danger',
          }).then(toast => toast.present());
        }
      );
    }
  }

  private listar() {
    this.usuarioService.getUsuario().subscribe(
      (dados) => {
        this.usuarios = dados;
      },
      (erro) => {
        console.error(erro);
      }
    );
  }
}
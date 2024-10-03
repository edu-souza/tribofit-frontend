import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Usuario } from "../types/usuario.interface";
import { Subscription } from "rxjs";
import { UsuariosService } from "../services/usuarios.services";
import { ToastController } from "@ionic/angular";
import { AuthService } from "../../authentication/auth.service";
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
})

export class UsuarioComponent implements OnInit, OnDestroy {
  usuario: Usuario | null | undefined = undefined;
  imagem: string | ArrayBuffer | null = '';
  private subscriptions = new Subscription();

  constructor(
    private usuarioService: UsuariosService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private authService: AuthService
  ) {}

  editarPerfil(){
    this.router.navigate(['/tabs/usuario/edicao']);
  }

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

  private loadUserData(): void {
    const token = this.authService.getToken();
    if (token) {
      const userData = jwtDecode(token);
      if (userData && userData.sub) {
        this.usuarioService.getUsuarioById(userData.sub).subscribe(
          (response) => {
            this.usuario = response; // Atribui o usuário retornado
            if (this.usuario && this.usuario.imagem){
              this.loadImagem(this.usuario.imagem);
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
  }

  private loadImagem(filename: string): void {
    this.usuarioService.getImagem(filename).subscribe(
      (blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.imagem = reader.result;
        };
        reader.readAsDataURL(blob);
      },
      (error) => {
        console.error('Erro ao carregar a imagem do usuário 4:', error);
        this.showErrorToast('Erro ao carregar a imagem do usuário.');
      }
    );
  }

  ngOnInit(): void {
    // Atualiza os dados do usuário ao iniciar e quando a rota muda
    this.loadUserData();
    this.subscriptions.add(
      this.activatedRoute.params.subscribe(() => {
        this.loadUserData();
      })
    );
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Credencial } from '../types/credencial.interface';
import { LoginService } from '../services/login.service';
import { AuthService } from 'src/app/authentication/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagina-login',
  templateUrl: './pagina-login.component.html',
  styleUrls: ['./pagina-login.component.css'],
})
export class PaginaLoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private loginService: LoginService,
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router
  ) {
    this.loginForm = this.createForm();
  }

  ngOnInit() { }

  createForm(credencial?: Credencial) {
    return new FormGroup({
      login: new FormControl(credencial?.login || '', [Validators.required]),
      senha: new FormControl(credencial?.senha || '', [Validators.required]),
    });
  }

  async onLogin() {
    if (this.loginForm.valid) {
      const credencial: Credencial = {
        login: this.loginForm.get('login')?.value,
        senha: this.loginForm.get('senha')?.value
      };

      this.loginService.signIn(credencial.login, credencial.senha).subscribe(
        response => {
          console.log('Login bem-sucedido:', response);
          this.authService.saveToken(response.access_token);
          console.log(this.authService.getToken);

          this.router.navigate(['tabs/eventos']);
        },
        async error => {
          this.errorMessage = 'Email ou senha incorretos';
          await this.presentToast(this.errorMessage);
          console.error('Erro ao fazer login:', error);
        }
      );
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios';
      await this.presentToast(this.errorMessage);
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

  get login() {
    return this.loginForm.get('login');
  }

  get senha() {
    return this.loginForm.get('senha');
  }
}

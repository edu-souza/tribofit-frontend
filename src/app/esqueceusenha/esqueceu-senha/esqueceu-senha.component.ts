import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../login/services/login.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-esqueceu-senha',
  templateUrl: './esqueceu-senha.component.html',
  styleUrls: ['./esqueceu-senha.component.css'],
})
export class EsqueceuSenhaComponent {
  forgotPasswordForm: FormGroup;
  message: string | null = null;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private toastController: ToastController,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.loginService.forgotPassword(this.forgotPasswordForm.value.email).subscribe(
        async () => {
          this.message = 'Verifique seu e-mail para redefinir a senha.';
          await this.presentToast(this.message, 'primary');
          this.router.navigate(['']);
        },
        async error => {
          this.message = 'Erro ao tentar enviar o e-mail de recuperação. Tente novamente.';
          await this.presentToast(this.message, 'danger');
          console.error('Erro:', error);
        }
      );
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    toast.present();
  }

  onBack() {
    this.router.navigate(['']); 
  }

  goToResetPassword() {
    // Navega para a tela de atualização de senha
    this.router.navigate(['/atualizar-senha']);
  }
}

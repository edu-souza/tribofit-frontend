import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/login/services/login.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-atualizar-senha',
  templateUrl: './atualizar-senha.component.html',
  styleUrls: ['./atualizar-senha.component.css'],
})
export class AtualizarSenhaComponent {
  updatePasswordForm: FormGroup;
  codeForm: FormGroup;
  isCodeValid: boolean = false;
  message: string | null = null;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private toastController: ToastController,
    private router: Router
  ) {
    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    this.updatePasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async validateCode() {
    console.log('Função validateCode chamada');
    console.log('Formulário válido:', this.codeForm.valid);

    if (this.codeForm.valid) {
      const { code } = this.codeForm.value;
      console.log('Código enviado:', code);

      // Chamada ao back-end para validar o código
      this.loginService.validateResetCode(code).subscribe(
        async () => {
          this.isCodeValid = true;
          this.message = null;
          await this.presentToast('Código válido!', 'primary');
        },
        async (error) => {
          this.isCodeValid = false;
          this.message = 'Código inválido ou expirado.';
          await this.presentToast('Código inválido ou expirado.', 'danger');
        }
      );
    } else {
      console.log('Formulário inválido');
    }
  }

  async onSubmit() {
    if (this.updatePasswordForm.valid && this.isCodeValid) {
      const { newPassword, confirmPassword } = this.updatePasswordForm.value;
      if (newPassword !== confirmPassword) {
        this.message = 'As senhas não coincidem. Tente novamente.';
        await this.presentToast('As senhas não coincidem. Tente novamente.', 'danger');
        return;
      }
      const { code } = this.codeForm.value;
      this.loginService.resetPassword(code, newPassword).subscribe(
        async () => {
          this.message = 'Senha atualizada com sucesso!';
          await this.presentToast('Senha atualizada com sucesso!', 'primary');
          this.router.navigate(['']);
        },
        async () => {
          this.message = 'Erro ao atualizar a senha.';
          await this.presentToast('Erro ao atualizar a senha.', 'danger');
        }
      );
    }
  }

  onBack() {
    this.router.navigate(['/esqueceu-senha']);
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
    });
    toast.present();
  }
}

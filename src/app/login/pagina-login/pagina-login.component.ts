import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Credencial } from '../types/credencial.interface';
import { LoginService } from '../services/login.service';
import { AuthService } from 'src/app/authentication/auth.service';
@Component({
  selector: 'app-pagina-login',
  templateUrl: './pagina-login.component.html',
  styleUrls: ['./pagina-login.component.css'],
})
export class PaginaLoginComponent implements OnInit {
  loginForm!: FormGroup;
  private loginService: LoginService;
  private authService: AuthService;

  constructor(
    loginService: LoginService,
    authService: AuthService
  ) {
    this.loginService = loginService;
    this.authService = authService;
    this.loginForm = this.createForm();
    
  }

  ngOnInit() { }

  createForm(credencial?: Credencial) {
    return new FormGroup({
      login: new FormControl(credencial?.login || '', [Validators.required]),

      senha: new FormControl(credencial?.senha || '', [Validators.required]),

    })
  }

  onLogin(){
    console.log('Entrou no login')
    if (this.loginForm.valid) {

      // Crie uma variável para armazenar o resultado do formulário
      const credencial: Credencial = {
        login: this.loginForm.get('login')?.value,
        senha: this.loginForm.get('senha')?.value
      };

      this.loginService.signIn(credencial.login, credencial.senha).subscribe(
        response => {
          
          console.log('Login bem-sucedido:', response);
          this.authService.saveToken(response.access_token)
          console.log(this.authService.getToken);
        },
        error => {
          // Lógica para lidar com erros
          console.error('Erro ao fazer login:', error);
        }
      );

    } else {
      // Manipule o caso em que o formulário não é válido
      console.error('O formulário não é válido');
    }
  }

  get login() {
    return this.loginForm.get('login');
  }

  get senha() {
    return this.loginForm.get('senha');
  }

}

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Credencial } from '../types/credencial.interface';
@Component({
  selector: 'app-pagina-login',
  templateUrl: './pagina-login.component.html',
  styleUrls: ['./pagina-login.component.scss'],
})
export class PaginaLoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor() {
    this.loginForm = this.createForm();
  }

  ngOnInit() { }

  createForm(credencial?: Credencial) {
    return new FormGroup({
      login: new FormControl(credencial?.login || '', [Validators.required]),

      senha: new FormControl(credencial?.senha || '', [Validators.required]),

    })
  }

  get login() {
    return this.loginForm.get('login');
  }

  get senha() {
    return this.loginForm.get('senha');
  }

}

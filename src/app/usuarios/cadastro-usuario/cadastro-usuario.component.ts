import { Component, OnInit } from "@angular/core";
import { UsuariosService } from "../services/usuarios.services";
import { Router, ActivatedRoute } from "@angular/router";
import { Usuario } from "../types/usuario.interface";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from "rxjs";


@Component({
  selector: 'cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html'
})

export class CadastroUsuarioComponent implements OnInit {

  usuarioId!: number;
  usuarioNome!: string;
  usuariosForm: FormGroup;
  private subscriptions = new Subscription();
  private EMAIL_PATTERN: RegExp = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);

  constructor(
    private usuarioService: UsuariosService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.usuariosForm = this.createForm();
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.usuarioId = parseInt(id);
      this.subscriptions.add(
        this.usuarioService.getUsuario(this.usuarioId).subscribe(
          (usuario) => {
            this.usuarioNome = usuario.nome
            this.usuariosForm = this.createForm(usuario)
          }
        )
      )
    }
  }

  private cidadeValidator: ValidatorFn = (control: AbstractControl<any, any>): ValidationErrors | null => {
    const cidadeSul = ['Forquilhinha', 'Ararangua', 'Criciuma']
    if (!cidadeSul.includes(control.value)) {
      return { cidadeInvalida: true }
    }
    return null;
  }

  private createForm(usuario?: Usuario) {
    return new FormGroup({
      image: new FormControl(usuario?.image || '', [Validators.required]),

      cidade: new FormControl(usuario?.cidade || '', [Validators.required, this.cidadeValidator]),

      data_nascto: new FormControl(usuario?.data_nascto || new Date().toISOString(), [Validators.required]),

      email: new FormControl(usuario?.email || '', [Validators.required, Validators.pattern(this.EMAIL_PATTERN)]),

      senha: new FormControl(usuario?.senha || '', [Validators.required]),

    })
  }

  get email() {
    return this.usuariosForm.get('email');
  }

  get cidade() {
    return this.usuariosForm.get('cidade');
  }

}
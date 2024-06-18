import { Component, OnInit } from "@angular/core";
import { UsuariosService } from "../services/usuarios.services";
import { Router, ActivatedRoute } from "@angular/router";
import { Usuario } from "../types/usuario.interface";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from "rxjs";
import { ToastController } from "@ionic/angular";


@Component({
  selector: 'cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html'
})

export class CadastroUsuarioComponent implements OnInit {

  usuarioId!: string;
  usuarioNome!: string;
  usuariosForm: FormGroup;
  private subscriptions = new Subscription();
  private EMAIL_PATTERN: RegExp = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);

  constructor(
    private usuarioService: UsuariosService,
    private router: Router,
    private toastController: ToastController,
    private activatedRoute: ActivatedRoute) {
    this.usuariosForm = this.createForm();
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.usuarioId = id;
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

  salvar() {
    const usuario: Usuario = {
      ...this.usuariosForm.value,
      id: this.usuarioId,
    };
    console.log(usuario);
    this.usuarioService.salvar(usuario).subscribe(
      () => this.router.navigate(['tabs/tab1']),
      (erro) => {
        console.error(erro);
        this.toastController
          .create({
            message: `Não foi possível salvar o registro. ${erro.error.message}`,
            duration: 5000,
            keyboardClose: true,
            color: 'danger',
          })
          .then((t) => t.present());
      }
    );
  }


  private createForm(usuario?: Usuario) {
    return new FormGroup({
      image: new FormControl(usuario?.image || '', [Validators.required]),

      nome: new FormControl(usuario?.nome || '', [Validators.required]),

      cidade: new FormControl(usuario?.cidade || '', [Validators.required]),

      dataNascimento: new FormControl(usuario?.dataNascimento || new Date().toISOString(), [Validators.required]),

      email: new FormControl(usuario?.email || '', [Validators.required, Validators.pattern(this.EMAIL_PATTERN)]),

      senha: new FormControl(usuario?.senha || '', [Validators.required]),

    })
  }

  get image() {
    return this.usuariosForm.get('image');
  }

  get nome() {
    return this.usuariosForm.get('nome');
  }

  get cidade() {
    return this.usuariosForm.get('cidade');
  }

  get dataNascto() {
    return this.usuariosForm.get('data_nascto');
  }

  get email() {
    return this.usuariosForm.get('email');
  }

  get senha() {
    return this.usuariosForm.get('senha');
  }

}
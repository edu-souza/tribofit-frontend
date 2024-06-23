import { Component, OnDestroy, OnInit } from "@angular/core";
import { UsuariosService } from "../services/usuarios.services";
import { Router, ActivatedRoute } from "@angular/router";
import { Usuario } from "../types/usuario.interface";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from "rxjs";
import { ToastController } from "@ionic/angular";
import { Cidade } from "src/app/core/cidade.interface";
import { CidadesService } from "src/app/core/cidade-service";


@Component({
  selector: 'cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html'
})

export class CadastroUsuarioComponent implements OnInit, OnDestroy {

  usuarioId!: string;
  usuarioNome!: string;
  usuariosForm: FormGroup;
  cidades: Cidade[] = [];
  usuarioCidade!: Cidade;
  private subscriptions = new Subscription();
  private EMAIL_PATTERN: RegExp = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);

  constructor(
    private usuarioService: UsuariosService,
    private cidadeService: CidadesService,
    private router: Router,
    private toastController: ToastController,
    private activatedRoute: ActivatedRoute) {
    this.usuariosForm = this.createForm();
  }

  ngOnInit(): void {
    this.carregaCidades();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.usuarioId = id;
      this.subscriptions.add(
        this.usuarioService.getUsuarioById(this.usuarioId).subscribe(
          (usuario) => {
            console.log(usuario)
            this.usuariosForm = this.createForm(usuario)
            //this.usuarioCidade = usuario?.cidade || ;
            // console.log(this.usuarioCidade)
          }
        )
      )
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  salvar() {
    if (this.usuariosForm.valid) {
      const usuario: Usuario = {
        ...this.usuariosForm.value,
        id: this.usuarioId,
      };
      this.usuarioService.salvar(usuario).subscribe(
        () => this.router.navigate(['tabs/usuarios']),
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
    } else {
      this.usuariosForm.markAllAsTouched();
    }
  }

  private carregaCidades() {
    this.subscriptions.add(
      this.cidadeService.getCidade().subscribe(
        (response) => {
          this.cidades = response;
        },
        (erro) => {
          console.error('Error occurred:', erro);
        }
      )
    );
  }

  compareFn(c1: Cidade, c2: Cidade): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  private createForm(usuario?: Usuario) {
    return new FormGroup({
      nome: new FormControl(usuario?.nome || '', [Validators.required]),

      cidade: new FormControl(usuario?.cidade || '', [Validators.required]),

      dataNascimento: new FormControl(usuario?.dataNascimento || new Date().toISOString(), [Validators.required]),

      email: new FormControl(usuario?.email || '', [Validators.required, Validators.pattern(this.EMAIL_PATTERN)]),

      senha: new FormControl(usuario?.senha || '', [Validators.required]),

    })
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
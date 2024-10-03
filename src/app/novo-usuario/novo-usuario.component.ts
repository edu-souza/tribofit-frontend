import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Usuario } from "../usuarios/types/usuario.interface";
import { Subscription } from "rxjs";
import { Cidade } from "../core/cidade.interface";
import { CidadesService } from "../core/cidade-service";
import { UsuariosService } from "../usuarios/services/usuarios.services";
import { AlertController, ToastController } from "@ionic/angular";


@Component({
  selector: 'novo-usuario',
  templateUrl: './novo-usuario.component.html',
  styleUrls: ['./novo-usuario.component.css'],
})

export class NovoUsuarioComponent implements OnInit, OnDestroy {
  imagem: string | ArrayBuffer | null = null;
  usuariosForm: FormGroup;
  file: File | null = null; 
  cidades: Cidade[] = [];
  private subscriptions = new Subscription();
  private EMAIL_PATTERN: RegExp = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);

  constructor(
    private usuarioService: UsuariosService,
    private cidadeService: CidadesService,
    private router: Router,
    private toastController: ToastController,
  ){
    this.usuariosForm = this.createForm();
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

  onUploadImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.file = file; 

      const reader = new FileReader();
      reader.onload = () => {
        this.imagem = reader.result; 
      };
      reader.readAsDataURL(file);
    }
  }

  onClick() {
    if (this.usuariosForm.valid && this.file) {
      const formData = new FormData();
      
      // Adicionando os campos do formulário ao FormData
      formData.append('nome', this.usuariosForm.get('nome')?.value);
      formData.append('email', this.usuariosForm.get('email')?.value);
      formData.append('cidade', this.usuariosForm.get('cidade')?.value);
      formData.append('dataNascimento', this.usuariosForm.get('dataNascimento')?.value);
      formData.append('senha', this.usuariosForm.get('senha')?.value);
      formData.append('acesso', 'user');

      // Adicionando o arquivo de imagem ao FormData
      formData.append('imagem', this.file, this.file.name); // Nome do arquivo é mantido

      // Chamar o serviço de salvar com o formData
      this.usuarioService.salvar(formData).subscribe(response => {
        this.showSuccessToast('Usuário salvo com sucesso!');
        this.router.navigate(['/']);
      }, error => {
        console.error('Erro ao salvar usuário', error);
        this.showErrorToast(error.error.message);
      });
    } else if (!this.file) {
      this.showErrorToast('Por favor, carregue uma imagem antes de salvar.');
    } else {
      this.showErrorToast('Por favor, preencha todos os campos com informações válidas.');
    }
  }

  passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const senhaControl = formGroup.get('senha');
    const confirmSenhaControl = formGroup.get('confirmSenha');

    if (!senhaControl || !confirmSenhaControl) {
      return null; 
    }

    const senha = senhaControl.value;
    const confirmSenha = confirmSenhaControl.value;

    return senha === confirmSenha ? null : { mismatch: true };
  }

  ngOnInit(): void {
    this.carregaCidades();
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private carregaCidades() {
    this.subscriptions.add(
      this.cidadeService.getCidade().subscribe(
        (response) => {
          this.cidades = response;
        },
        (erro) => {
          console.error('Erro ao carregar as cidades:', erro);
        }
      )
    );
  }

  private createForm(usuario?: Usuario) {
    return new FormGroup({
      nome: new FormControl(usuario?.nome || '', [Validators.required]),
      cidade: new FormControl(usuario?.cidade || '', [Validators.required]),
      dataNascimento: new FormControl(usuario?.dataNascimento || new Date().toISOString(), [Validators.required]),
      email: new FormControl(usuario?.email || '', [Validators.required, Validators.pattern(this.EMAIL_PATTERN)]),
      senha: new FormControl(usuario?.senha || '', [Validators.required]),
      confirmSenha: new FormControl('', [Validators.required]), 
      imagem: new FormControl('')  
    }, { validators: this.passwordMatchValidator });
  }

  compareFn(c1: Cidade, c2: Cidade): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}
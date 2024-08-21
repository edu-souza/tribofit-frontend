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
  usuariosForm: FormGroup;
  imagem: string = ''; 
  cidades: Cidade[] = [];
  imagemMimeType: string = '';
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
      this.usuarioService.uploadFile(file).subscribe(response => {
        this.imagem = response.filename; // Armazena o nome do arquivo retornado
      }, error => {
        console.error('Erro ao fazer upload da imagem', error);
      });
    }
  }

  onClick() {
    if (this.usuariosForm.valid && this.imagem) {
      const usuario: Usuario = {
        nome: this.usuariosForm.get('nome')?.value,
        email: this.usuariosForm.get('email')?.value,
        cidade: this.usuariosForm.get('cidade')?.value,
        dataNascimento: this.usuariosForm.get('dataNascimento')?.value,
        senha: this.usuariosForm.get('senha')?.value,
        imagem: this.imagem 
      };
  
      console.log(usuario);

      this.usuarioService.salvar(usuario).subscribe(response => {

        this.showSuccessToast('Usuário salvo com sucesso!');
        this.router.navigate(['/']);
      }, error => {
        console.error('Erro ao salvar usuário', error);
        this.showErrorToast(error.error.message);
      });
    } else if (!this.imagem) {
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      console.log(file);
      this.convertFileToBase64(file);
    }
  }

  convertFileToBase64(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Obtemos o resultado da leitura do arquivo
      const result = reader.result as string;
      // Extrai o tipo da imagem e a base64 sem o prefixo
      const mimeTypeMatch = result.match(/^data:image\/[^;]+/);
      const base64Data = mimeTypeMatch ? result.replace(/^data:image\/[^;]+;base64,/, '') : '';
      const mimeType = mimeTypeMatch ? mimeTypeMatch[0] : '';
      
      this.imagem = base64Data;
      this.imagemMimeType = mimeType; // Armazena o tipo da imagem
      this.usuariosForm.patchValue({ imagem: this.imagem });
      console.log('Base64 da imagem:', this.imagem);  // Exibe o base64 da imagem no console
      console.log('Tipo da imagem:', this.imagemMimeType); // Exibe o tipo da imagem
    };
  }

  getImageSrc(): string {
    return this.imagemMimeType ? `data:${this.imagemMimeType};base64,${this.imagem}` : '';
  }

  private carregaCidades() {
    this.subscriptions.add(
      this.cidadeService.getCidade().subscribe(
        (response) => {
          console.log(response);
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
      confirmSenha: new FormControl('', [Validators.required]), // Campo temporário para validação
      imagem: new FormControl('')  // Adicione este campo
    }, { validators: this.passwordMatchValidator });
  }

  compareFn(c1: Cidade, c2: Cidade): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
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

  get confirmSenha() {
    return this.usuariosForm.get('confirmSenha');
  }
}

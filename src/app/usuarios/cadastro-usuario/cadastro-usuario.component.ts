import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from "rxjs";
import { ToastController } from "@ionic/angular";
import { Cidade } from "src/app/core/cidade.interface";
import { UsuariosService } from "../services/usuarios.services";
import { CidadesService } from "src/app/core/cidade-service";
import { Usuario } from "../types/usuario.interface";
import { AuthService } from "src/app/authentication/auth.service";
import { jwtDecode } from "jwt-decode";
import { Location } from "@angular/common";


@Component({
  selector: 'cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css'],
})

export class CadastroUsuarioComponent implements OnInit, OnDestroy {
  usuario: Usuario | null | undefined = undefined;
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
    private authService: AuthService,
    private location: Location,
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
        console.log('Arquivo enviado:', response);
        this.imagem = response.filename; // Armazena o nome do arquivo retornado
      }, error => {
        console.error('Erro ao fazer upload da imagem', error);
      });
    }
  }

  salvar() {
    if (this.usuariosForm.valid && this.imagem) {
      const usuario: Usuario = {
        id: this.usuario?.id,
        nome: this.usuariosForm.get('nome')?.value,
        email: this.usuariosForm.get('email')?.value,
        cidade: this.usuariosForm.get('cidade')?.value,
        dataNascimento: this.usuariosForm.get('dataNascimento')?.value,
        senha: this.usuariosForm.get('senha')?.value ? this.usuariosForm.get('senha')?.value : this.usuario?.senha, 
        imagem: this.imagem,
      };
  
      this.usuarioService.salvar(usuario).subscribe(
        (response) => {
          this.showSuccessToast('Usuário salvo com sucesso!');
          this.router.navigate(['/tabs/usuario']);
        },
        (error) => {
          console.error('Erro ao salvar usuário', error);
          this.showErrorToast(error.error.message);
        }
      );
    } else if (!this.imagem) {
      this.showErrorToast('Por favor, carregue uma imagem antes de salvar.');
    } else {
      this.showErrorToast('Por favor, preencha todos os campos com informações válidas.');
    }
  }

  cancelar(){
    this.location.back();
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

    const token = this.authService.getToken();
    if (token) {
      const userData = jwtDecode(token);
      if (userData && userData.sub) {
        this.usuarioService.getUsuarioById(userData.sub).subscribe(
          (response) => {
            this.usuario = response; // Atribui o usuário retornado
          this.usuariosForm = this.createForm(this.usuario); // Atualiza o formulário com os dados do usuário
          if (this.usuario?.imagem) {
            this.imagem = this.usuario.imagem; // Atualiza a imagem se existir
            this.imagemMimeType = 'image/jpeg'; // Ajuste conforme necessário
          }
          },
          (error) => {
            console.error('Erro ao carregar dados do usuário:', error);
            this.showErrorToast('Erro ao carregar dados do usuário.');
          }
        );
      } else {
        console.warn('Id do usuário não encontrado no token.');
      }
    } else {
      console.warn('Token é nulo');
    }
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
    return new FormGroup(
      {
        nome: new FormControl(usuario?.nome || '', [Validators.required]),
        cidade: new FormControl(usuario?.cidade || '', [Validators.required]),
        dataNascimento: new FormControl(usuario?.dataNascimento || new Date().toISOString(), [Validators.required]),
        email: new FormControl(usuario?.email || '', [Validators.required, Validators.pattern(this.EMAIL_PATTERN)]),
        senha: new FormControl('', [Validators.required]), // Sempre inicializado vazio
        confirmSenha: new FormControl('', [Validators.required]), // Campo para confirmação de senha
        imagem: new FormControl(''), 
      },
      { validators: this.passwordMatchValidator }
    );
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

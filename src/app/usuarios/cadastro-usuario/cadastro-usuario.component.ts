import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Subscription } from "rxjs";
import { ToastController } from "@ionic/angular";
import { Cidade } from "src/app/core/cidade.interface";
import { UsuariosService } from "../services/usuarios.services";
import { CidadesService } from "src/app/core/cidade-service";
import { Usuario } from "../types/usuario.interface";
import { AuthService } from "src/app/authentication/auth.service";
import { jwtDecode } from "jwt-decode";
import { Location } from "@angular/common";
import { ComunicacaoService } from "../services/comunicacao.service";

@Component({
  selector: 'cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css'],
})

export class CadastroUsuarioComponent implements OnInit, OnDestroy {
  usuariosForm: FormGroup;
  imagem: string | ArrayBuffer | null = null;
  file: File | null = null; 
  cidades: Cidade[] = [];
  private subscriptions = new Subscription();
  private EMAIL_PATTERN: RegExp = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);

  constructor(
    private usuarioService: UsuariosService,
    private cidadeService: CidadesService,
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService,
    private location: Location,
    private comunicacaoService: ComunicacaoService
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

  salvar() {
    if (this.usuariosForm.valid) {
      const formData = new FormData();
      
      // Adicionando os campos do formulário ao FormData
      formData.append('nome', this.usuariosForm.get('nome')?.value);
      formData.append('email', this.usuariosForm.get('email')?.value);
      formData.append('cidade', this.usuariosForm.get('cidade')?.value);
      formData.append('dataNascimento', this.usuariosForm.get('dataNascimento')?.value);
      formData.append('senha', this.usuariosForm.get('senha')?.value);
      formData.append('acesso', 'user');
    
      // Verifique se o ID está presente e adicione ao FormData
      const usuarioId = this.usuariosForm.get('id')?.value;
      if (usuarioId) {
        formData.append('id', usuarioId); 
      }
    
      // Verifica se o arquivo de imagem foi modificado
      if (this.file) {
        formData.append('imagem', this.file, this.file.name);
      } else if (this.usuariosForm.get('imagem')?.value) {
        // Adiciona o nome do arquivo da imagem existente
        formData.append('imagem', this.usuariosForm.get('imagem')?.value);
      }
      // Chama o serviço de salvar com o formData
      this.usuarioService.salvar(formData).subscribe(response => {
        this.showSuccessToast('Usuário salvo com sucesso!');
        this.comunicacaoService.emitirAtualizacaoImagem(this.imagem?.toString() || '');
        this.router.navigate(['/tabs/usuario']);
      }, error => {
        console.error('Erro ao salvar usuário', error);
        this.showErrorToast(error.error.message);
      });
    } else {
      this.showErrorToast('Por favor, preencha todos os campos com informações válidas e carregue uma imagem antes de salvar.');
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
            if (response) { // Verificação adicional para garantir que 'response' não seja 'undefined'

              const usuario: Usuario = {
                id: response.id,
                nome: response.nome,
                email: response.email,
                cidade: response.cidade, // Atribua o ID da cidade corretamente
                dataNascimento: response.dataNascimento,
                senha: '', // Deixe a senha vazia por segurança
                acesso: response.acesso,
                imagem: response.imagem,
              };
  
              this.usuariosForm = this.createForm(usuario); // Atualize o formulário com os dados transformados

              if (response.imagem) {
                this.loadImagem(response.imagem);
              }
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

  private loadImagem(filename: string): void {
    this.usuarioService.getImagem(filename).subscribe(
      (blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.imagem = reader.result;
        };
        reader.readAsDataURL(blob);
      },
      (error) => {
        console.error('Erro ao carregar a imagem do usuário 3:', error);
        this.showErrorToast('Erro ao carregar a imagem do usuário.');
      }
    );
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
      id: new FormControl(usuario?.id || ''), 
      nome: new FormControl(usuario?.nome || '', [Validators.required]),
//      cidade: new FormControl(usuario?.cidade.id || '', [Validators.required]),
      cidade: new FormControl(usuario?.cidade?.id || '', [Validators.required]),
      dataNascimento: new FormControl(usuario?.dataNascimento || new Date().toISOString(), [Validators.required]),
      email: new FormControl(usuario?.email || '', [Validators.required, Validators.pattern(this.EMAIL_PATTERN)]),
      senha: new FormControl('', [Validators.required]),
      confirmSenha: new FormControl('', [Validators.required]),
      imagem: new FormControl(''),
    }, { validators: this.passwordMatchValidator });
  }

  compareFn(c1: string, c2: string): boolean {
    return c1 === c2; // Comparando os IDs de cidade (strings)
  }
}
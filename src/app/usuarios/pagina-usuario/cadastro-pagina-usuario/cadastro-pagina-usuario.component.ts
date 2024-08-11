import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UsuariosService } from '../../services/usuarios.services';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../types/usuario.interface';
import { menus } from 'src/app/core/menu/menus';

@Component({
  selector: 'app-cadastro-pagina-usuario',
  templateUrl: './cadastro-pagina-usuario.component.html',
  styleUrls: ['./cadastro-pagina-usuario.component.scss'],
})
export class CadastroPaginaUsuarioComponent  implements OnInit {

  usuarioId!: string;
  usuarioNome: string = '';
  usuariosForm: FormGroup;
  menus = menus;

  private subscriptions = new Subscription();
  private EMAIL_PATTERN: RegExp = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);

  constructor(
    private usuarioService: UsuariosService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.usuariosForm = this.createForm();
  }

  ngOnInit(): void {
    const id = '123e4567-e89b-12d3-a456-426614174000'//this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.usuarioId = id;
      this.subscriptions.add(
        this.usuarioService.getUsuarioById(this.usuarioId).subscribe(
          (usuario) => {
            this.usuarioNome = usuario ? usuario.nome : 'Novo usuário'
            this.usuariosForm = this.createForm(usuario)
          }
        )
      )
    }
  }


  private createForm(usuario?: Usuario) {
    return new FormGroup({
      //image: new FormControl(usuario?.image || '', [Validators.required]),
      cidade: new FormControl(usuario?.cidade.nome || '', [Validators.required]),
      dataNascimento: new FormControl(
        usuario?.dataNascimento ? new Date(usuario.dataNascimento).toLocaleDateString('pt-BR') : '', 
        [Validators.required]
      ),
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

  get dataNascimento() {
    return this.usuariosForm.get('dataNascimento');
  }

  get senha() {
    return this.usuariosForm.get('senha');
  }


}

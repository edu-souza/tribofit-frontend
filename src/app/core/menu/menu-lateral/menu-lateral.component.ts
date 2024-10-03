import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/auth.service';
import { menus } from 'src/app/core/menu/menus';
import { ComunicacaoService } from 'src/app/usuarios/services/comunicacao.service';
import { UsuariosService } from 'src/app/usuarios/services/usuarios.services';
import { Usuario } from 'src/app/usuarios/types/usuario.interface';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.scss'],
})
export class MenuLateralComponent implements OnInit {
  menus = menus;
  usuarioLogado: any;
  isAdmin: boolean = false;
  imagem: string | ArrayBuffer | null = null;
  nome : string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private usuarioService: UsuariosService,
    private comunicacaoService: ComunicacaoService
  ) {
      this.comunicacaoService.imagemAtualizada$.subscribe((novaImagem) => {
      if (novaImagem) {
        this.imagem = novaImagem || null;
      }
    });
  }

  ngOnInit(): void {
    this.usuarioLogado = this.authService.getUsuarioLogado();
    this.isAdmin = this.usuarioLogado.acesso === 'admin';
    this.filtraMenus(menus);
    this.usuarioService.getUsuarioById(this.usuarioLogado.sub).subscribe(
      (response) => {
        if (response) {
          if (response.imagem) {
            this.loadImagem(response.imagem); 
          } else {
            this.imagem = null; 
          }
          this.nome = response.nome;
        } else {
          console.warn('Nenhum usuário encontrado.');
        }
      },
      (error) => {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    );
  }
  

  loadImagem(filename: string): void {
    this.usuarioService.getImagem(filename).subscribe(
      (blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.imagem = reader.result;
        };
        reader.readAsDataURL(blob);
      },
      (error) => {
        console.error('Erro ao carregar a imagem do usuário 1:', error);
      }
    );
  }

  filtraMenus(aMenus : any){
    this.menus = aMenus.filter((menu: any) => {
      if (this.isAdmin) {
        return true;
      }
      return menu.acesso === 'user';
    });
  }

}

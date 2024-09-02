import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/auth.service';
import { menus } from 'src/app/core/menu/menus';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.scss'],
})
export class MenuLateralComponent implements OnInit {
  menus = menus;
  usuarioLogado: any;
  isAdmin: boolean = false;

  constructor(private router: Router,
    private authService: AuthService
  ){
    this.usuarioLogado = this.authService.getUsuarioLogado()
    this.isAdmin = this.usuarioLogado.acesso == 'admin' ? true : false;
  }

  ngOnInit(): void {
    this.filtraMenus(menus)
  }

  filtraMenus(aMenus : any){
    this.menus = aMenus.filter((menu: any) => {
      if (this.isAdmin) {
        return true;
      }
      return menu.acesso === 'user';
    });
  }

  @Input() side: 'start' | 'end' = 'end';
  @Input() menuId: string = '';
  @Input() contentId: string = '';
  @Input() qtdEventosPend: number = 0;

}

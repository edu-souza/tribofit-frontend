import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaginaLoginComponent } from './pagina-login/pagina-login.component';
import { EsqueceuSenhaComponent } from '../esqueceusenha/esqueceu-senha/esqueceu-senha.component';
import { AtualizarSenhaComponent } from '../esqueceusenha/atualizar-senha/atualizar-senha.component';

const routes: Routes = [
  {
    path: '',
    component: PaginaLoginComponent
  },
  {
    path: 'esqueceu-senha',
    component: EsqueceuSenhaComponent
  },
  {
    path: 'atualizar-senha',
    component: AtualizarSenhaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule { }

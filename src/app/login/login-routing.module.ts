import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaginaLoginComponent } from './login/pagina-login.component';

const routes: Routes = [
  {
    path: '',
    component: PaginaLoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule { }

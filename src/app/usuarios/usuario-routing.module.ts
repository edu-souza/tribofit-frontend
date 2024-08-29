import { NgModule } from "@angular/core";
import { Routes, RouterModule, Router } from "@angular/router";
import { UsuarioComponent } from "./lista-usuario/usuario.component";
import { CadastroUsuarioComponent } from "./cadastro-usuario/cadastro-usuario.component";

const routes: Routes = [
  {
    path: '',
    component: UsuarioComponent
  },
  {
    path: 'edicao',
    component: CadastroUsuarioComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UsuarioRoutingModule { }
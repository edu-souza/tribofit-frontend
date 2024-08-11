import { NgModule } from "@angular/core";
import { Routes, RouterModule, Router } from "@angular/router";
import { ListaUsuarioComponent } from "./lista-usuario/lista-usuario.component";
import { CadastroUsuarioComponent } from "./cadastro-usuario/cadastro-usuario.component";
import { CadastroPaginaUsuarioComponent } from "./pagina-usuario/cadastro-pagina-usuario/cadastro-pagina-usuario.component";

const routes: Routes = [
  {
    path: '',
    component: ListaUsuarioComponent
  },
  {
    path: 'usuario',
    component: ListaUsuarioComponent
  },
  {
    path: 'usuario-cadastro/:id',
    component: CadastroUsuarioComponent
  },
  {
    path: 'edicao-perfil/:id',
    component: CadastroPaginaUsuarioComponent
  },
  {
    path: 'usuario-cadastro',
    component: CadastroUsuarioComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UsuarioRoutingModule { }
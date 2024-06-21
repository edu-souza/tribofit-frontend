import { NgModule } from "@angular/core";
import { Routes, RouterModule, Router } from "@angular/router";
import { ListaModalidadeComponent } from "./lista-modalidade/lista-modalidade.component";
import { CadastroModalidadeComponent } from "./cadastro-modalidade/cadastro-modalidade.component";

const routes: Routes = [
  {
    path: 'modalidades',
    component: ListaModalidadeComponent
  },
  {
    path: 'modalidade-cadastro/:id',
    component: CadastroModalidadeComponent
  },
  {
    path: 'modalidade-cadastro',
    component: CadastroModalidadeComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ModalidadeRoutingModule { }
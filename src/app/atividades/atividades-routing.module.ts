import { NgModule } from "@angular/core";
import { Routes, RouterModule, Router } from "@angular/router";
import { ListaAtividadesComponent } from "./lista-atividades/lista-atividades.component";
import { CadastroAtividadesComponent } from "./cadastro-atividades/cadastro-atividades.component";
import { DetalheAtividadesComponent } from "./detalhe-atividades/detalhe-atividades.component";

const routes: Routes = [
  {
    path: 'atividades',
    component: ListaAtividadesComponent
  },
  {
    path: 'cadastro-atividades',
    component: CadastroAtividadesComponent
  },
  {
    path: 'detalhe-atividades',
    component: DetalheAtividadesComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AtividadesRoutingModule { }
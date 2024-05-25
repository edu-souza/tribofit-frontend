import { NgModule } from "@angular/core";
import { Routes, RouterModule, Router } from "@angular/router";
import { ListaAtividadesComponent } from "./lista-atividades/lista-atividades.component";

const routes: Routes = [
  {
    path: 'atividades',
    component: ListaAtividadesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AtividadesRoutingModule { }
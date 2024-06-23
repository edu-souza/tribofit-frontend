import { NgModule } from "@angular/core";
import { Routes, RouterModule, Router } from "@angular/router";
import { ListaEventosComponent } from "./lista-eventos/lista-eventos.component";
import { CadastroEventosComponent } from "./cadastro-eventos/cadastro-eventos.component";
import { DetalheEventosComponent } from "./detalhe-eventos/detalhe-eventos.component";

const routes: Routes = [
  {
    path: '',
    component: ListaEventosComponent
  },
  {
    path: 'eventos',
    component: ListaEventosComponent
  },
  {
    path: 'cadastro-eventos',
    component: CadastroEventosComponent
  },
  {
    path: 'edicao-eventos/:id',
    component: CadastroEventosComponent
  },
  {
    path: 'detalhe-eventos',
    component: DetalheEventosComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class EventosRoutingModule { }
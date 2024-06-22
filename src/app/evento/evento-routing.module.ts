import { NgModule } from "@angular/core";
import { Routes, RouterModule, Router } from "@angular/router";
import { ListaEventoComponent } from "./lista-evento/lista-evento.component";
import { CadastroEventoComponent } from "./cadastro-evento/cadastro-evento.component";
import { DetalheEventoComponent } from "./detalhe-evento/detalhe-evento.component";

const routes: Routes = [
  {
    path: 'eventos',
    component: ListaEventoComponent
  },
  {
    path: 'cadastro-eventos',
    component: CadastroEventoComponent
  },
  {
    path: 'edicao-eventos/:id',
    component: CadastroEventoComponent
  },
  {
    path: 'detalhe-eventos',
    component: DetalheEventoComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class EventoRoutingModule { }
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListaEventoComponent } from "./lista-evento/lista-evento.component";
import { CadastroEventoComponent } from "./cadastro-evento/cadastro-evento.component";

const routes: Routes = [
  {
    path: '',
    component: ListaEventoComponent
  },
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class EventoRoutingModule { }
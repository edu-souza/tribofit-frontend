import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AtividadesCadastroComponent } from './atividades-cadastro/atividades-cadastro.component';
import { AtividadesListaComponent } from './atividades-lista/atividades-lista.component';

const routes: Routes = [
  {
    path: 'lista-atividades',
    component: AtividadesListaComponent
  },
  {
    path: 'cadastro-atividades',
    component: AtividadesCadastroComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AtividadesRoutingModule { }

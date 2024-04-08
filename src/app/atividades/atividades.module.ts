import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AtividadesCadastroComponent } from './atividades-cadastro/atividades-cadastro.component';
import { AtividadesListaComponent } from './atividades-lista/atividades-lista.component';
import { AtividadesRoutingModule } from './atividades-routing.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [AtividadesListaComponent, AtividadesCadastroComponent],
  imports: [
    AtividadesRoutingModule,
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule
  ],
  exports: [AtividadesListaComponent, AtividadesCadastroComponent]
})
export class AtividadesModule { }

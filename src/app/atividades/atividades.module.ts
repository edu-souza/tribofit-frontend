import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ListaAtividadesComponent } from './lista-atividades/lista-atividades.component';
import { HttpClientModule } from "@angular/common/http";
import { AtividadesRoutingModule } from './atividades-routing.module';

@NgModule({
  declarations: [ListaAtividadesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule,
    AtividadesRoutingModule
  ],
  exports: [ListaAtividadesComponent]

})
export class AtividadesModule { }

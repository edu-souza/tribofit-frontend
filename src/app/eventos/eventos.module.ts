import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { EventosRoutingModule } from './eventos-routing.module';
import { CadastroEventosComponent } from './cadastro-eventos/cadastro-eventos.component';
import { DatePipe } from '@angular/common';
import { ListaEventosComponent } from './lista-eventos/lista-eventos.component';
import { DetalheEventosComponent } from './detalhe-eventos/detalhe-eventos.component';

@NgModule({
  declarations: [ListaEventosComponent, CadastroEventosComponent, DetalheEventosComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule,
    DatePipe,
    EventosRoutingModule
  ],
  exports: [ListaEventosComponent, CadastroEventosComponent, DetalheEventosComponent],
  providers: [DatePipe],

})
export class EventosModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { EventoRoutingModule } from './evento-routing.module';
import { CadastroEventoComponent } from './cadastro-evento/cadastro-evento.component';
import { DatePipe } from '@angular/common';
import { ListaEventoComponent } from './lista-evento/lista-evento.component';

@NgModule({
  declarations: [ListaEventoComponent, CadastroEventoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule,
    DatePipe,
    EventoRoutingModule
  ],
  exports: [ListaEventoComponent, CadastroEventoComponent],
  providers: [DatePipe],

})
export class EventoModule { }

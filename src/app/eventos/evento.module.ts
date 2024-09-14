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
import { MeusEventosComponent } from './meus-eventos/meus-eventos.component';
import { AdminEventoComponent } from './admin-evento/admin-evento.component';
import { SolicitacoesPendentesComponent } from './solicitacoes-pendentes/solicitacoes-pendentes.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [ListaEventoComponent,CadastroEventoComponent,MeusEventosComponent,AdminEventoComponent,SolicitacoesPendentesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule,
    DatePipe,
    EventoRoutingModule,
    CoreModule
  ],
  exports: [ListaEventoComponent,CadastroEventoComponent,MeusEventosComponent,AdminEventoComponent,SolicitacoesPendentesComponent],
  providers: [DatePipe],

})
export class EventoModule { }

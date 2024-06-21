import { NgModule } from "@angular/core";
import { ListaModalidadeComponent } from "./lista-modalidade/lista-modalidade.component";
import { CadastroModalidadeComponent } from "./cadastro-modalidade/cadastro-modalidade.component";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ModalidadeRoutingModule } from "./modalidades-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { DatePipe } from '@angular/common';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    HttpClientModule,
    ReactiveFormsModule,
    DatePipe,
    ModalidadeRoutingModule],
  declarations: [ListaModalidadeComponent, CadastroModalidadeComponent],
  exports: [ListaModalidadeComponent, CadastroModalidadeComponent]
})

export class ModalidadesModule { }
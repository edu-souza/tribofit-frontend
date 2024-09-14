import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatePipe } from '@angular/common';
import { UsuarioComponent } from "./lista-usuario/usuario.component";
import { UsuarioRoutingModule } from "./usuario-routing.module";
import { CadastroUsuarioComponent } from "./cadastro-usuario/cadastro-usuario.component";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    HttpClientModule,
    ReactiveFormsModule,
    DatePipe,
    FormsModule,
    UsuarioRoutingModule,
    ],
  declarations: [UsuarioComponent,CadastroUsuarioComponent],
  exports: []
})

export class UsuarioModule { }
import { NgModule } from "@angular/core";
import { ListaUsuarioComponent } from "./lista-usuario/lista-usuario.component";
import { CadastroUsuarioComponent } from "./cadastro-usuario/cadastro-usuario.component";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { UsuarioRoutingModule } from "./usuarios-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { DatePipe } from '@angular/common';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    HttpClientModule,
    ReactiveFormsModule,
    DatePipe,
    UsuarioRoutingModule],
  declarations: [ListaUsuarioComponent, CadastroUsuarioComponent],
  exports: [ListaUsuarioComponent, CadastroUsuarioComponent]
})

export class UsuariosModule { }
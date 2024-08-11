import { NgModule } from "@angular/core";
import { ListaUsuarioComponent } from "./lista-usuario/lista-usuario.component";
import { CadastroUsuarioComponent } from "./cadastro-usuario/cadastro-usuario.component";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { UsuarioRoutingModule } from "./usuarios-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { DatePipe } from '@angular/common';
import { CadastroPaginaUsuarioComponent } from "./pagina-usuario/cadastro-pagina-usuario/cadastro-pagina-usuario.component";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    HttpClientModule,
    ReactiveFormsModule,
    DatePipe,
    UsuarioRoutingModule],
  declarations: [ListaUsuarioComponent, CadastroUsuarioComponent,CadastroPaginaUsuarioComponent],
  exports: [ListaUsuarioComponent, CadastroUsuarioComponent,CadastroPaginaUsuarioComponent]
})

export class UsuariosModule { }
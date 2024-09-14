import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginRoutingModule } from './login-routing.module';
import { TabsPageRoutingModule } from '../tabs/tabs-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginaLoginComponent } from './pagina-login/pagina-login.component';
import { EsqueceuSenhaComponent } from '../esqueceusenha/esqueceu-senha/esqueceu-senha.component';
import { AtualizarSenhaComponent } from '../esqueceusenha/atualizar-senha/atualizar-senha.component';

@NgModule({
  declarations: [PaginaLoginComponent,EsqueceuSenhaComponent, AtualizarSenhaComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LoginRoutingModule,
    TabsPageRoutingModule
  ]
})
export class LoginModule { }

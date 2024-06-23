import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginRoutingModule } from './login-routing.module';
import { TabsPageRoutingModule } from '../tabs/tabs-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginaLoginComponent } from './pagina-login/pagina-login.component';

@NgModule({
  declarations: [PaginaLoginComponent],
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

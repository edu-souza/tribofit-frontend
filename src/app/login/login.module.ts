import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TabsPageRoutingModule } from '../tabs/tabs-routing.module';
import { LoginRoutingModule } from './login-routing.module';
import { PaginaLoginComponent } from './pagina-login/pagina-login.component';

@NgModule({
  declarations: [PaginaLoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginRoutingModule,
    TabsPageRoutingModule,
  ]
})
export class LoginModule { }

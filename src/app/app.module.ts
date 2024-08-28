import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ModalidadesModule } from './modalidades/modalidades.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { TokenInterceptor } from './authentication/auth.interceptor';
import { NovoUsuarioModule } from './novo-usuario/novo-usuario.module';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ModalidadesModule,
    UsuariosModule,
    NovoUsuarioModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
              { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true } 
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

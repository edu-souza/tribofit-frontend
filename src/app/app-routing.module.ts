import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NovoUsuarioComponent } from './novo-usuario/novo-usuario.component';
import { LogoutComponent } from './logout/logout.component';
import { NotificacaoComponent } from './notificacoes/notificacao.component';

const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'novo-usuario',
    component: NovoUsuarioComponent
  },
  { path: 'logout', 
    component: LogoutComponent 
  },
  { path: 'notificacoes', 
    component: NotificacaoComponent 
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { UsuarioComponent } from '../usuarios/lista-usuario/usuario.component';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'usuario',
        loadChildren: () => import('../usuarios/usuario.module').then(m => m.UsuarioModule)

      },
      {
        path: 'usuarios',
        component: ListaUsuarioComponent,
        loadChildren: () => import('../usuarios/usuarios.module').then(m => m.UsuariosModule)
      },
      {
        path: 'eventos',
        loadChildren: () => import('../eventos/evento.module').then(m => m.EventoModule)
      },
      {
        path: 'modalidades',
        loadChildren: () => import('../modalidades/modalidades.module').then(m => m.ModalidadesModule)
      },
      {
        path: 'participando',
        loadChildren: () => import('../eventos/evento.module').then(m => m.EventoModule)
      },
      {
        path: '',
        redirectTo: '/tabs/eventos',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/eventos',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }

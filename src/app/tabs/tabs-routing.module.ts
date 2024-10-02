import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { MeusEventosComponent } from '../eventos/meus-eventos/meus-eventos.component';
import { AdminEventoComponent } from '../eventos/admin-evento/admin-evento.component';
import { SolicitacoesPendentesComponent } from '../eventos/solicitacoes-pendentes/solicitacoes-pendentes.component';
import { UsuarioComponent } from '../usuarios/lista-usuario/usuario.component';
import { NotificacaoComponent } from '../notificacoes/notificacao.component';

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
        component: UsuarioComponent,
        loadChildren: () => import('../usuarios/usuario.module').then(m => m.UsuarioModule)
      },
      {
        path: 'eventos',
        loadChildren: () => import('../eventos/evento.module').then(m => m.EventoModule)
      },
      {
        path: 'eventos-admin',
        component: AdminEventoComponent,
        loadChildren: () => import('../eventos/evento.module').then(m => m.EventoModule)
      },
      {
        path: 'solicitacoes-pendentes',
        component: SolicitacoesPendentesComponent,
        loadChildren: () => import('../eventos/evento.module').then(m => m.EventoModule)
      },
      {
        path: 'modalidades',
        loadChildren: () => import('../modalidades/modalidades.module').then(m => m.ModalidadesModule)
      },
      {
        path: 'notificacoes',
        component: NotificacaoComponent,
        loadChildren: () => import('../notificacoes/notificacao.module').then(m => m.NotificacaoModule)
      },
      {
        path: 'meus-eventos',
        component: MeusEventosComponent,
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

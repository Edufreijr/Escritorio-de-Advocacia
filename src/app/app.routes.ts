import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Areas } from './pages/areas/areas';
import { Lawyers } from './pages/lawyers/lawyers';
import { Appointment } from './pages/appointment/appointment';
import { Contact } from './pages/contact/contact';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';
import { Admin } from './pages/admin/admin';
import { MinhaConta } from './pages/minha-conta/minha-conta';
import { PainelAdvogado } from './pages/painel-advogado/painel-advogado';
import { NotFound } from './pages/not-found/not-found';

import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'sobre',
    component: About,
  },
  {
    path: 'areas',
    component: Areas,
  },
  {
    path: 'advogados',
    component: Lawyers,
  },
  {
    path: 'agendamento',
    component: Appointment,
  },
  {
    path: 'contato',
    component: Contact,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'cadastro',
    component: Cadastro,
  },
  {
    path: 'admin',
    component: Admin,
    canActivate: [authGuard(['admin'])],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/admin-dashboard/admin-dashboard').then(
            (m) => m.AdminDashboard,
          ),
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./pages/admin-usuarios/admin-usuarios').then(
            (m) => m.AdminUsuarios,
          ),
      },
      {
        path: 'advogados',
        loadComponent: () =>
          import('./pages/admin-advogados/admin-advogados').then(
            (m) => m.AdminAdvogados,
          ),
      },
      {
        path: 'agendamentos',
        loadComponent: () =>
          import('./pages/admin-agendamentos/admin-agendamentos').then(
            (m) => m.AdminAgendamentos,
          ),
      },
      {
        path: 'mensagens',
        loadComponent: () =>
          import('./pages/admin-mensagens/admin-mensagens').then(
            (m) => m.AdminMensagens,
          ),
      },
    ],
  },
  {
    path: 'painel-advogado',
    component: PainelAdvogado,
    canActivate: [authGuard(['lawyer'])],
  },
  {
    path: 'minha-conta',
    component: MinhaConta,
    canActivate: [authGuard(['user'])],
  },
  {
    path: '**',
    component: NotFound,
  },
];

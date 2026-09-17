import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { guestGuard } from './core/guest.guard';
import { Shell } from './layout/shell';
import { Login } from './pages/login/login';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    component: Login,
  },
  {
    path: '',
    canActivate: [authGuard],
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'my-courses' },
      {
        path: 'my-courses',
        loadComponent: () => import('./pages/my-courses/my-courses').then((m) => m.MyCourses),
      },
      {
        path: 'course/:id/simplified',
        loadComponent: () => import('./pages/course/course').then((m) => m.CoursePage),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./pages/notifications/notifications').then((m) => m.Notifications),
      },
      {
        path: 'messages',
        loadComponent: () => import('./pages/messages/messages').then((m) => m.Messages),
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'teams/01',
        loadChildren: () => import('./teams/team-01/team-01.routes').then((m) => m.TEAM_ROUTES),
      },
      {
        path: 'teams/02',
        loadChildren: () => import('./teams/team-02/team-02.routes').then((m) => m.TEAM_ROUTES),
      },
      {
        path: 'teams/03',
        loadChildren: () => import('./teams/team-03/team-03.routes').then((m) => m.TEAM_ROUTES),
      },
      {
        path: 'teams/04',
        loadChildren: () => import('./teams/team-04/team-04.routes').then((m) => m.TEAM_ROUTES),
      },
      {
        path: 'teams/05',
        loadChildren: () => import('./teams/team-05/team-05.routes').then((m) => m.TEAM_ROUTES),
      },
      {
        path: 'teams/06',
        loadChildren: () => import('./teams/team-06/team-06.routes').then((m) => m.TEAM_ROUTES),
      },
      {
        path: 'teams/07',
        loadChildren: () => import('./teams/team-07/team-07.routes').then((m) => m.TEAM_ROUTES),
      },
      {
        path: 'teams/08',
        loadChildren: () => import('./teams/team-08/team-08.routes').then((m) => m.TEAM_ROUTES),
      },
      {
        path: 'teams/09',
        loadChildren: () => import('./teams/team-09/team-09.routes').then((m) => m.TEAM_ROUTES),
      },
      {
        path: 'teams/10',
        loadChildren: () => import('./teams/team-10/team-10.routes').then((m) => m.TEAM_ROUTES),
      },
      {
        path: 'teams/11',
        loadChildren: () => import('./teams/team-11/team-11.routes').then((m) => m.TEAM_ROUTES),
      },
      {
        path: 'teams/12',
        loadChildren: () => import('./teams/team-12/team-12.routes').then((m) => m.TEAM_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: '/my-courses' },
];

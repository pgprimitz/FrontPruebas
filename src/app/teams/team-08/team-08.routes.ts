import { Routes } from '@angular/router';

export const TEAM_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./team-08.page').then((m) => m.TeamPage),
  },
];

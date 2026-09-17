import { Routes } from '@angular/router';

export const TEAM_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./team-03.page').then((m) => m.TeamPage),
  },
];

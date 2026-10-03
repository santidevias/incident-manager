import { Routes } from '@angular/router';

export const INCIDENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/incident-list/incident-list.component').then(m => m.IncidentListComponent)
  },
];

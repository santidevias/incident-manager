import { Routes } from '@angular/router';

export const INCIDENTS_ROUTES: Routes = [
  {
    path: '', // Al ser la raíz del módulo, mapea directamente al componente
    loadComponent: () => import('./pages/incident-list/incident-list.component').then(m => m.IncidentListComponent)
  },
];

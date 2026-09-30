import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '', // Al ser la raíz del módulo, mapea directamente al componente
    loadComponent: () => import('./pages/stats/stats.component').then(m => m.StatsComponent)
  },
];

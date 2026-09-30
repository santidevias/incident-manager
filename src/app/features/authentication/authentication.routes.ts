import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '', // Al ser la raíz del módulo, mapea directamente al componente
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
];

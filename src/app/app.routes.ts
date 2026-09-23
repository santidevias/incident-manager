import { Routes } from '@angular/router';
import { hasRoleGuard } from './core/guards/role-guard';
import { Dashboard } from './dashboard/dashboard';
import { Authentication } from './features/authentication/authentication';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Authentication },
  {
    path: 'admin/dashboard',
    component: Dashboard,
    canActivate: [hasRoleGuard(['admin'])]
  },
  {
    path: 'support/incidents',
    component: Dashboard,
    canActivate: [hasRoleGuard(['support', 'admin'])]
  },
  {
    path: 'tickets/my-requests',
    component: Dashboard,
    canActivate: [hasRoleGuard(['requester'])]
  },
  { path: '**', redirectTo: 'login' }
];

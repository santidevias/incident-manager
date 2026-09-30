import { RouterOutlet, Routes } from '@angular/router';
import { hasRoleGuard, roleRedirectGuard } from './core/guards/role-guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./features/authentication/authentication.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [hasRoleGuard(['admin', 'support', 'requester'])],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: RouterOutlet,
        canActivate: [roleRedirectGuard()],
      },
      {
        path: 'dashboard',
        canActivate: [hasRoleGuard(['admin'])],
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      },
      {
        path: 'incidents',
        canActivate: [hasRoleGuard(['admin', 'support', 'requester'])],
        loadChildren: () => import('./features/incidents/incidents.routes').then(m => m.INCIDENTS_ROUTES)
      }
    ],
  },
  { path: '**', redirectTo: 'login' }
];

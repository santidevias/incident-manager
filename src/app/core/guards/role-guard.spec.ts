import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { hasRoleGuard } from './role-guard';

describe('hasRoleGuard', () => {
  // 1. Creamos mocks básicos para evitar errores de inyección
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(() => {
    mockAuthService = { currentUser: jasmine.createSpy('currentUser').and.returnValue({ role: 'admin' }) };
    mockRouter = { navigate: jasmine.createSpy('navigate') };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: PLATFORM_ID, useValue: 'browser' } // Simulamos que estamos en el navegador
      ]
    });
  });

  // 2. Corregimos la ejecución: Primero instanciamos el guard con los roles, y luego lo ejecutamos
  const executeGuard = (allowedRoles: string[], route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
    TestBed.runInInjectionContext(() => hasRoleGuard(allowedRoles)(route, state));

  it('should allow access if user has the allowed role', () => {
    // Simulamos los parámetros requeridos por CanActivateFn
    const dummyRoute = {} as ActivatedRouteSnapshot;
    const dummyState = {} as RouterStateSnapshot;

    // Ejecutamos el guard esperando un resultado booleano
    const result = executeGuard(['admin'], dummyRoute, dummyState);

    expect(result).toBe(true);
  });
});

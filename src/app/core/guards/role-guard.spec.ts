import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Ajusta la ruta a tu servicio
import { hasRoleGuard } from './role-guard'; // Ajusta la ruta a tu archivo

describe('hasRoleGuard', () => {
  // 1. Definimos los objetos mock con funciones espía de Vitest (vi.fn)
  const mockRouter = {
    createUrlTree: vi.fn((commands: any) => ({ tree: commands }) as unknown as UrlTree)
  };

  const mockAuthService = {
    currentUser: vi.fn()
  };

  // Limpiamos los mocks antes de cada prueba para que no se contaminen entre sí
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Función de ayuda para cambiar el entorno (Browser vs Server) dinámicamente
  function setupGuardEnvironment(platform: 'browser' | 'server') {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: PLATFORM_ID, useValue: platform }
      ]
    });
  }

  it('debe retornar true inmediatamente si se ejecuta en el Servidor (SSR)', () => {
    setupGuardEnvironment('server');

    const result = TestBed.runInInjectionContext(() =>
      hasRoleGuard(['admin'])({} as any, {} as any)
    );

    expect(result).toBe(true);
    // Verificación extra de seguridad: El servicio jamás debió ser consultado en el servidor
    expect(mockAuthService.currentUser).not.toHaveBeenCalled();
  });

  it('debe retornar true si el rol del usuario está incluido en los roles permitidos', () => {
    setupGuardEnvironment('browser');
    // Simulamos que el servicio retorna un usuario con rol 'support'
    mockAuthService.currentUser.mockReturnValue({ role: 'support' });

    const result = TestBed.runInInjectionContext(() =>
      hasRoleGuard(['admin', 'support'])({} as any, {} as any)
    );

    expect(result).toBe(true);
  });

  it('debe retornar un UrlTree hacia /login si el rol del usuario NO está permitido', () => {
    setupGuardEnvironment('browser');
    // El usuario tiene rol 'requester', pero el guard solo permite 'admin'
    mockAuthService.currentUser.mockReturnValue({ role: 'requester' });

    const result = TestBed.runInInjectionContext(() =>
      hasRoleGuard(['admin'])({} as any, {} as any)
    );

    // Validamos que devuelva la estructura del UrlTree de redirección
    expect(result).toEqual({ tree: ['/login'] });
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});

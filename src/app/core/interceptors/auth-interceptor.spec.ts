import { HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Ajusta la ruta a tu servicio
import { authInterceptor } from './auth-interceptor';

describe('authInterceptor', () => {
  // 1. Mocks de los servicios que inyecta el interceptor
  const mockRouter = {
    navigate: vi.fn()
  };

  const mockAuthService = {
    logout: vi.fn()
  };

  // 2. Mock del siguiente manejador (next) que simula el flujo de la petición
  const mockNext = vi.fn((req: HttpRequest<any>) => of({} as HttpEvent<any>));

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear(); // Limpiamos el almacenamiento local antes de cada prueba
  });

  // Función de ayuda para inicializar el contexto con la plataforma correcta
  function setupInterceptorContext(platform: 'browser' | 'server') {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: PLATFORM_ID, useValue: platform }
      ]
    });
  }

  // =========================================================================
  // ESCENARIO 1: SERVIDOR (SSR) -> No debe buscar en localStorage ni agregar token
  // =========================================================================
  it('debe pasar la petición original sin alterar si se ejecuta en el Servidor (SSR)', () => {
    setupInterceptorContext('server');

    // El espía de localStorage no debería ser llamado, pero ponemos un token por si acaso
    const spyGetItem = vi.spyOn(Storage.prototype, 'getItem');

    const reqBase = new HttpRequest('GET', '/api/incidents');

    // Ejecutamos el interceptor en el entorno seguro de inyección de Angular
    TestBed.runInInjectionContext(() =>
      authInterceptor(reqBase, mockNext)
    );

    // Verificaciones
    expect(spyGetItem).not.toHaveBeenCalled();
    // Validamos que 'next' recibió exactamente la petición original sin cabeceras extra
    const reqSend: HttpRequest<any> = mockNext.mock.calls[0][0];
    expect(reqSend.headers.has('Authorization')).toBe(false);
    expect(reqSend).toBe(reqBase);
  });

  // =========================================================================
  // ESCENARIO 2: NAVEGADOR CON TOKEN -> Debe clonar la petición y agregar el Bearer
  // =========================================================================
  it('debe agregar el encabezado Authorization Bearer si hay un token en el Navegador', () => {
    setupInterceptorContext('browser');
    localStorage.setItem('auth_token', 'fake-jwt-token-123');

    const reqBase = new HttpRequest('GET', '/api/incidents');

    TestBed.runInInjectionContext(() =>
      authInterceptor(reqBase, mockNext)
    );

    // Capturamos el clon modificado que se le pasó a la función 'next'
    const reqClone: HttpRequest<any> = mockNext.mock.calls[0][0];

    // Verificaciones de cabeceras agregadas
    expect(reqClone.headers.get('Authorization')).toBe('Bearer fake-jwt-token-123');
    expect(reqClone.headers.get('Content-Type')).toBe('application/json');
    expect(reqClone.headers.get('Accept')).toBe('application/json');
    // Confirmamos que es un objeto clonado nuevo, no la misma instancia mutada
    expect(reqClone).not.toBe(reqBase);
  });

  // =========================================================================
  // ESCENARIO 3: NAVEGADOR SIN TOKEN -> Debe retornar la petición idéntica recibida
  // =========================================================================
  it('debe pasar la petición original intacta si NO hay token en el Navegador', () => {
    setupInterceptorContext('browser');
    // Aseguramos que localStorage esté completamente vacío para esta prueba

    const reqBase = new HttpRequest('GET', '/api/incidents');

    TestBed.runInInjectionContext(() =>
      authInterceptor(reqBase, mockNext)
    );

    const reqSend: HttpRequest<any> = mockNext.mock.calls[0][0];

    // Verificaciones
    expect(reqSend.headers.has('Authorization')).toBe(false);
    expect(reqSend).toBe(reqBase); // Debe ser la misma referencia en memoria
  });

  // =========================================================================
  // EXTRA: PRUEBA DEL FLUJO DE ERROR 401 EN EL NAVEGADOR
  // =========================================================================
  it('debe hacer logout y redirigir a /login ante un error 401 en el Navegador', () => {
    setupInterceptorContext('browser');

    // Forzamos al mockNext a retornar una respuesta fallida con estatus 401
    const error401 = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
    mockNext.mockReturnValue(throwError(() => error401));

    const reqBase = new HttpRequest('GET', '/api/incidents');

    // Debemos suscribirnos al flujo retornado para que RxJS ejecute la tubería del catchError
    TestBed.runInInjectionContext(() =>
      authInterceptor(reqBase, mockNext)
    ).subscribe({
      error: (err) => {
        expect(err.status).toBe(401);
      }
    });

    // Verificaciones de efectos secundarios
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});

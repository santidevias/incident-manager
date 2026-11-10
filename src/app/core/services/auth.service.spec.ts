import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserResponse } from '../models/auth.model';
import { AuthService } from './auth.service';

const jest = vi;

describe('AuthService (Entorno Navegador)', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockRouter = {
    navigate: jest.fn()
  };

  const mockUser: UserResponse['user'] = {
    id: '1',
    email: 'soporte@ias.com.co',
    name: 'Soporte IAS',
    role: 'support',
    agentId: 'agt-200',
  };

  const mockResponse: UserResponse = {
    token: 'fake-jwt-token-123',
    user: mockUser
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ==========================================
  // FLUJO 1: CONSTRUCTOR / INITIAL STATE
  // ==========================================
  it('debe cargar el usuario desde localStorage en el estado inicial si existe', () => {
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
    const nuevaInstancia = TestBed.runInInjectionContext(() => new AuthService());
    expect(nuevaInstancia.currentUser()).toEqual(mockUser);
  });

  // ==========================================
  // FLUJO 2: FUNCIONALIDAD DE LOGIN
  // ==========================================
  it('debe realizar la petición POST de login, guardar en localStorage y actualizar la Signal', async () => {
    const credenciales = { email: 'soporte@ias.com.co', password: 'password123' };
    const loginPromesa = firstValueFrom(service.login(credenciales));

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credenciales);
    req.flush(mockResponse);

    const response = await loginPromesa;

    expect(response).toEqual(mockResponse);
    expect(localStorage.getItem('auth_token')).toBe('fake-jwt-token-123');
    expect(localStorage.getItem('auth_user')).toContain('soporte@ias.com.co');
    expect(service.currentUser()).toEqual(mockUser);
  });

  // ==========================================
  // FLUJO 3: FUNCIONALIDAD DE LOGOUT
  // ==========================================
  it('debe limpiar localStorage, resetear la Signal a null y redirigir a /login', async () => {
    localStorage.setItem('auth_token', 'token-valido');
    localStorage.setItem('auth_user', JSON.stringify(mockUser));

    const loginPromesa = firstValueFrom(service.login({ email: 'soporte@ias.com.co', password: '123' }));
    httpMock.expectOne(`${environment.apiUrl}/auth/login`).flush(mockResponse);
    await loginPromesa;

    service.logout();

    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
    expect(service.currentUser()).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  // ==========================================
  // FLUJO 4: COMPUTED PROP - ROLE
  // ==========================================
  it('debe retornar el rol correcto mediante el computed "role" o "requester" si es nulo', async () => {
    expect(service.role()).toBe('requester');

    const loginPromesa = firstValueFrom(service.login({ email: '', password: '' }));
    httpMock.expectOne(`${environment.apiUrl}/auth/login`).flush(mockResponse);
    await loginPromesa;

    expect(service.role()).toBe('support');
  });

  // ==========================================
  // FLUJO 5: COMPUTED PROP - ROLE INITIAL
  // ==========================================
  it('debe retornar la primera letra del rol usando "roleInitial"', async () => {
    expect(service.roleInitial()).toBe('r');

    const loginPromesa = firstValueFrom(service.login({ email: '', password: '' }));
    httpMock.expectOne(`${environment.apiUrl}/auth/login`).flush(mockResponse);
    await loginPromesa;

    expect(service.roleInitial()).toBe('s');
  });

  // =========================================================
  // COBERTURA DE EXCEPCIONES: MANEJO DE STORAGE DAÑADO (LÍNEA 66)
  // =========================================================
  describe('Manejo de Errores de Almacenamiento', () => {
    it('debe capturar la excepción y retornar null si el JSON de localStorage está corrupto (Línea 66)', () => {
      localStorage.setItem('auth_user', '{mal-formado}');

      const nuevaInstancia = TestBed.runInInjectionContext(() => new AuthService());

      expect(nuevaInstancia.currentUser()).toBeNull();
    });

    it('debe retornar "U" por defecto si el rol es una cadena vacía', () => {
      const usuarioRolVacio = { ...mockUser, role: '' };
      localStorage.setItem('auth_user', JSON.stringify(usuarioRolVacio));

      const nuevaInstancia = TestBed.runInInjectionContext(() => new AuthService());

      expect(nuevaInstancia.roleInitial()).toBe('U');
    });
  });
});

// =========================================================
// COBERTURA COMPLEMENTARIA: ENTORNO SERVIDOR / SSR (LÍNEA 49)
// =========================================================
describe('AuthService (Entorno Servidor / SSR)', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const mockRouter = {
    navigate: jest.fn()
  };
  const mockUser: UserResponse['user'] = {
    id: '1',
    email: 'sinnovedad@ias.com.co',
    name: 'Soporte IAS',
    role: 'support',
    agentId: 'agt-200',
  };

  const mockResponse: UserResponse = {
    token: 'fake-jwt-token-123',
    user: mockUser
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  it('debe retornar "requester" en la propiedad calculada de rol si se ejecuta en servidor (Línea 49)', () => {
    const serverService = TestBed.inject(AuthService);
    expect(serverService.role()).toBe('requester');
  });

  it('debe omitir la carga del almacenamiento local y mantener la señal de usuario en null', () => {
    const serverService = TestBed.inject(AuthService);
    const result = serverService['getUserFromStorage']();
    expect(result).toBeNull();
    expect(serverService.currentUser()).toBeNull();
  });

  it('debe realizar la petición POST de login, y no entra a guardar localstorage', async () => {
    const credenciales = { email: 'soporte@ias.com.co', password: 'password123' };
    const loginPromesa = firstValueFrom(service.login(credenciales));

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credenciales);
    req.flush(mockResponse);

    const response = await loginPromesa;

    expect(response).toEqual(mockResponse);
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
    expect(service.currentUser()).toEqual(mockUser);
  });

  it('debe resetear la Signal a null y redirigir a /login', async () => {
    const loginPromesa = firstValueFrom(service.login({ email: 'soporte@ias.com.co', password: '123' }));
    httpMock.expectOne(`${environment.apiUrl}/auth/login`).flush(mockResponse);
    await loginPromesa;

    service.logout();
    expect(service.currentUser()).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});

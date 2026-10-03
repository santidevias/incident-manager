import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserResponse } from '../models/auth.model'; // Ajusta la ruta a tu modelo
import { AuthService } from './auth.service'; // Ajusta la ruta a tu archivo

describe('AuthService (Entorno Navegador)', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  // Creamos el mock del Router para capturar la redirección del logout
  const mockRouter = {
    navigate: vi.fn()
  };

  // Objeto con datos de usuario simulados para las pruebas
  const mockUser: UserResponse['user'] = {
    id: '1',
    email: 'soporte@ias.com.co',
    name: 'Soporte IAS',
    role: 'support'
  };

  const mockResponse: UserResponse = {
    token: 'fake-jwt-token-123',
    user: mockUser
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(), // Intercepta las llamadas HTTP reales
        { provide: Router, useValue: mockRouter },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Asegura que no queden peticiones HTTP abiertas
  });

  // ==========================================
  // FLUJO 1: CONSTRUCTOR / INITIAL STATE
  // ==========================================
  it('debe cargar el usuario desde localStorage en el estado inicial si existe', () => {
    // Simulamos que el usuario ya tenía sesión activa antes de instanciar el servicio
    localStorage.setItem('auth_user', JSON.stringify(mockUser));

    // Creamos una nueva instancia local para forzar la ejecución del constructor con datos en storage
    const nuevaInstancia = TestBed.runInInjectionContext(() => new AuthService());

    expect(nuevaInstancia.currentUser()).toEqual(mockUser);
  });

  // ==========================================
  // FLUJO 2: FUNCIONALIDAD DE LOGIN
  // ==========================================
  it('debe realizar la petición POST de login, guardar en localStorage y actualizar la Signal', async () => {
    const credenciales = { email: 'soporte@ias.com.co', password: 'password123' };

    // 2. Convertimos el observable en una promesa usando firstValueFrom
    const loginPromesa = firstValueFrom(service.login(credenciales));

    // 3. Validamos la petición HTTP enviada e inyectamos la respuesta simulada
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credenciales);
    req.flush(mockResponse);

    // 4. Esperamos a que la promesa se resuelva para evaluar los resultados finales
    const response = await loginPromesa;

    // 5. Aserciones finales limpias
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

    // Login rápido simulado esperando que resuelva
    const loginPromesa = firstValueFrom(service.login({ email: 'soporte@ias.com.co', password: '123' }));
    httpMock.expectOne(`${environment.apiUrl}/auth/login`).flush(mockResponse);
    await loginPromesa;

    // Ejecutamos la acción de cierre de sesión
    service.logout();

    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
    expect(service.currentUser()).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  // ==========================================
  // FLUJO 4: COMPUTED PROP - ROLE
  // ==========================================
  it('debe retornar el rol correcto mediante el computed "role" o vacío si es nulo', async () => {
    expect(service.role()).toBe('');

    const loginPromesa = firstValueFrom(service.login({ email: '', password: '' }));
    httpMock.expectOne(`${environment.apiUrl}/auth/login`).flush(mockResponse);
    await loginPromesa;

    expect(service.role()).toBe('support');
  });

  // ==========================================
  // FLUJO 5: COMPUTED PROP - ROLE INITIAL
  // ==========================================
  it('debe retornar la primera letra en mayúscula del rol usando "roleInitial" o "U" por defecto', async () => {
    expect(service.roleInitial()).toBe('U');

    const loginPromesa = firstValueFrom(service.login({ email: '', password: '' }));
    httpMock.expectOne(`${environment.apiUrl}/auth/login`).flush(mockResponse);
    await loginPromesa;

    expect(service.roleInitial()).toBe('support'.charAt(0));
  });
});

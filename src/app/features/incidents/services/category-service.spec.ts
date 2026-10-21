import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Category } from '../models/incident.model';
import { CategoryService } from './category-service';

describe('CategoryService (Zoneless)', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl;

  // Mock de datos para las categorías
  const mockCategoriesResponse: ApiResponse<Category[]> = {
    success: true,
    message: '',
    data: [
      { id: 'cat-1', name: 'Hardware' },
      { id: 'cat-2', name: 'Software' }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategoryService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Garantiza que no queden peticiones colgadas
    httpMock.verify();
  });

  it('debe inicializar el signal de categorías vacío por defecto', () => {
    // Al instanciarse el servicio, el signal arranca con el arreglo vacío del fallback (?? [])
    expect(service.categories()).toEqual([]);
  });

  it('debe obtener y cargar las categorías en el signal computed exitosamente', async () => {
    // 1. Ejecutamos las microtareas del motor de Angular para disparar el stream del rxResource
    TestBed.tick();

    // 2. Interceptamos la petición HTTP específica de este servicio
    const req = httpMock.expectOne(`${baseUrl}/incidents/categories`);
    expect(req.request.method).toBe('GET');

    // 3. Enviamos la respuesta simulada
    req.flush(mockCategoriesResponse);

    // 4. Esperamos que el flujo reactivo actualice el signal interno del recurso
    await TestBed.inject(ApplicationRef).whenStable();

    // 5. Validamos que el computed extraiga la propiedad "data" correctamente
    expect(service.categories()).toEqual(mockCategoriesResponse.data);
    expect(service.categories().length).toBe(2);
  });

  it('debe retornar un arreglo vacío como fallback si la API responde con datos nulos o vacíos', async () => {
    TestBed.tick();

    const req = httpMock.expectOne(`${baseUrl}/incidents/categories`);
    // Simulamos una respuesta donde la propiedad data venga como null u omitida
    req.flush({ data: null });

    await TestBed.inject(ApplicationRef).whenStable();

    // Comprobamos que el operador de coalescencia nula (?? []) funcione de manera preventiva
    expect(service.categories()).toEqual([]);
  });
});

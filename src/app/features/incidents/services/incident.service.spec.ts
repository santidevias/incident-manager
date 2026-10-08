import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { Incident } from '../models/incident.model';
import { IncidentService } from './incident.service'; // Ajusta la ruta a tu archivo

describe('IncidentService', () => {
  let service: IncidentService;
  let httpMock: HttpTestingController;

  // 1. Datos simulados (Mock Data) para alimentar el rxResource
  const mockIncidents: Incident[] = [
    {
      "id": "inc-001",
      "title": "Error de Login",
      "description": "El usuario reporta que al intentar ingresar sus credenciales el sistema muestra un timeout constante. Se validó la conexión interna sin éxito.",
      "category": "Seguridad",
      "priority": "HIGH",
      "status": "OPEN",
      "reportId": "usr-120",
      "assignedAggentId": "agt-200",
      "createdAt": "2026-03-01T10:00:00.000Z",
      "updatedAt": "2026-03-01T19:52:00.000Z"
    },
    {
      "id": "inc-002",
      "title": "Base de datos lenta",
      "description": "Las métricas muestran picos de uso de CPU al 100% en el nodo principal. Múltiples transacciones encoladas esperando liberación de bloqueos.",
      "category": "Infraestructura",
      "priority": "HIGH",
      "status": "IN_PROGRESS",
      "reportId": "usr-100",
      "assignedAggentId": "agt-205",
      "createdAt": "2026-03-03T14:00:00.000Z",
      "updatedAt": "2026-03-03T16:23:00.000Z"
    },
    {
      "id": "inc-003",
      "title": "Fallo de Red en oficina",
      "description": "Switch principal del rack de comunicaciones fuera de línea. Todo el personal del área se encuentra incomunicado de la red local e internet.",
      "category": "Infraestructura",
      "priority": "LOW",
      "status": "CLOSED",
      "reportId": "usr-110",
      "assignedAggentId": "agt-205",
      "createdAt": "2026-03-02T08:00:00.000Z",
      "updatedAt": "2026-03-02T21:20:00.000Z"
    },
    {
      "id": "inc-004",
      "title": "Formulario roto",
      "description": "Al renderizar el componente en pantallas móviles, las coordenadas fallan y bloquean la acción principal de registro del cliente.",
      "category": "UI/UX",
      "priority": "MEDIUM",
      "status": "OPEN",
      "reportId": "usr-120",
      "assignedAggentId": "agt-205",
      "createdAt": "2026-03-04T09:00:00.000Z",
      "updatedAt": "2026-03-05T05:44:00.000Z"
    },
    {
      "id": "inc-005",
      "title": "Impresora sin tonner",
      "description": "Alerta física en hardware indica consumibles agotados. Se requiere intervención del proveedor asignado para el mantenimiento.",
      "category": "Infraestructura",
      "priority": "LOW",
      "status": "OPEN",
      "reportId": "usr-110",
      "assignedAggentId": "agt-205",
      "createdAt": "2026-03-05T11:00:00.000Z",
      "updatedAt": "2026-03-06T08:31:00.000Z"
    },
    {
      "id": "inc-006",
      "title": "Error de permisos",
      "description": "Varios perfiles de administrador perdieron privilegios de ejecución tras la última ventana de mantenimiento programada anoche.",
      "category": "Seguridad",
      "priority": "HIGH",
      "status": "OPEN",
      "reportId": "usr-120",
      "assignedAggentId": "agt-200",
      "createdAt": "2026-03-06T12:00:00.000Z",
      "updatedAt": "2026-03-06T15:17:00.000Z"
    }
  ];
  // 2. Envoltura exacta que espera el service: ApiResponse con la propiedad data
  const mockApiResponse = {
    data: mockIncidents
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        IncidentService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(IncidentService);
    service.incidents();
    TestBed.tick();

    const req = httpMock.expectOne(`${environment.apiUrl}/incidents`);
    req.flush(mockApiResponse);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ==========================================
  // FLUJO 1: CARGA INICIAL (rxResource)
  // ==========================================
  it('debe inicializar el recurso con incidentes del backend', () => {
    expect(service.incidents().length).toBe(6);
    expect(service.loading()).toBe(false);
  });

  // ==========================================
  // FLUJO 2: FILTRADO DE INCIDENTES (processedIncidents)
  // ==========================================
  describe('Filtros de Datos', () => {
    it('debe filtrar por un término de búsqueda (searchTerm)', () => {
      service.updateSearch('Base');

      const filtered = service.processedIncidents();
      expect(filtered.length).toBe(1);
      expect(filtered.every(i => i.category === 'Infraestructura')).toBe(true);
      expect(service.currentPage()).toBe(1);
    });

    it('debe filtrar por estado (statusFilter)', () => {
      service.updateStatus('OPEN');

      const filtered = service.processedIncidents();
      expect(filtered.length).toBe(4);
      expect(filtered.every(i => i.status === 'OPEN')).toBe(true);
    });

    it('debe filtrar por prioridad (priorityFilter)', () => {
      service.updatePriority('HIGH');

      const filtered = service.processedIncidents();
      expect(filtered.length).toBe(3);
      expect(filtered.every(i => i.priority === 'HIGH')).toBe(true);
    });
  });

  // ==========================================
  // FLUJO 3: ORDENAMIENTO (sortKey & sortDirection)
  // ==========================================
  describe('Ordenamiento de Datos', () => {
    it('debe ordenar por fecha (createdAt) de manera descendente por defecto', () => {
      const filtered = service.processedIncidents();

      // inc-006 es el más nuevo (6 de marzo), debe ir al inicio
      expect(filtered[0].id).toBe('inc-006');
      // inc-001 es el más viejo (1 de marzo), debe ir al final
      expect(filtered[filtered.length - 1].id).toBe('inc-001');
    });

    it('debe alternar la dirección cuando se ordena por la misma columna', () => {
      expect(service.sortDirection()).toBe('desc');

      service.changeSort('createdAt');
      expect(service.sortDirection()).toBe('asc');

      const filtered = service.processedIncidents();
      // Al cambiar a ascendente, el más viejo (1 de marzo) debe ir de primero
      expect(filtered[0].id).toBe('inc-001');
    });

    it('debe cambiar de columna y reiniciar la dirección a "asc" si es una nueva columna', () => {
      service.changeSort('title');

      expect(service.sortKey()).toBe('title');
      expect(service.sortDirection()).toBe('asc');
    });
  });

  // ==========================================
  // FLUJO 4: PAGINACIÓN (paginatedIncidents & metadata)
  // ==========================================
  describe('Paginación', () => {
    it('debe segmentar los datos según el pageSize (por defecto 5)', () => {
      service.pageSize.set(5);
      service.currentPage.set(1);

      const paginated = service.paginatedIncidents();
      expect(paginated.length).toBe(5);
      expect(service.totalPages()).toBe(2);
    });

    it('debe cambiar de página y mostrar el segmento correcto', () => {
      service.pageSize.set(5);
      service.currentPage.set(2);

      const paginated = service.paginatedIncidents();
      expect(paginated.length).toBe(1); // Solo queda el sexto registro
    });

    it('debe calcular correctamente los detalles de la paginación para la interfaz', () => {
      service.pageSize.set(5);

      service.currentPage.set(1);
      expect(service.paginationDetails()).toEqual({ from: 1, to: 5, total: 6 });

      service.currentPage.set(2);
      expect(service.paginationDetails()).toEqual({ from: 6, to: 6, total: 6 });
    });

    it('debe manejar correctamente los detalles de paginación si el resultado es vacío', () => {
      service.updateSearch('término_que_no_existe');

      expect(service.paginationDetails()).toEqual({ from: 0, to: 0, total: 0 });
      expect(service.totalPages()).toBe(1);
    });
  });
});

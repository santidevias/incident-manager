import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest'; // <-- Sintaxis de Vitest
import { environment } from '../../../../environments/environment';
import { DashboardMetricsAPIResponse, RecentIncidentsAPIResponse } from '../models/dashboard-inciendet-model';
import { DashboardIncendentService } from './dashboard-incendent-service';

describe('DashboardIncendentService (con rxResource y Vitest)', () => {
  let service: DashboardIncendentService;
  let httpMock: HttpTestingController;

  const mockMetrics: DashboardMetricsAPIResponse = {
    success: true,
    message: "Metricas de incidentes.",
    data: {
      total: 85,
      open: 10,
      inProgress: 20,
      closed: 50,
      criticalCount: 5,
      byCategory: {
        "Infraestructura": 25,
        "Pagos": 5,
        "Facturación": 35,
        "UI/UX": 15,
        "Seguridad": 5,
      }
    }
  };

  const mockIncidentsResponse: RecentIncidentsAPIResponse = {
    success: true,
    message: "Incidentes recientes.",
    data: [
      {
        "id": "INC-00000000",
        "title": "Spargo defendo voveo volva correptius.",
        "category": "Pagos",
        "priority": "MEDIUM",
        "status": "IN_PROGRESS",
        "createdAt": "Tue Oct 20 2026 22:38:44 GMT-0500 (hora estándar de Colombia)"
      },
      {
        "id": "INC-00000001",
        "title": "Quibusdam uredo sperno ubi sit.",
        "category": "Facturación",
        "priority": "CRITICAL",
        "status": "OPEN",
        "createdAt": "Wed Oct 21 2026 21:19:20 GMT-0500 (hora estándar de Colombia)"
      },
      {
        "id": "INC-00000002",
        "title": "Abeo argumentum perferendis suscipit adduco.",
        "category": "Facturación",
        "priority": "HIGH",
        "status": "OPEN",
        "createdAt": "Thu Oct 22 2026 00:28:59 GMT-0500 (hora estándar de Colombia)"
      },
      {
        "id": "INC-00000003",
        "title": "Cupiditate abduco tamisium ventosus sulum.",
        "category": "UI/UX",
        "priority": "CRITICAL",
        "status": "OPEN",
        "createdAt": "Tue Oct 20 2026 13:42:08 GMT-0500 (hora estándar de Colombia)"
      },
      {
        "id": "INC-00000004",
        "title": "Aureus conitor chirographum magnam defendo.",
        "category": "Pagos",
        "priority": "HIGH",
        "status": "OPEN",
        "createdAt": "Wed Oct 21 2026 01:05:08 GMT-0500 (hora estándar de Colombia)"
      },
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DashboardIncendentService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(DashboardIncendentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica que no queden peticiones HTTP colgadas/sin responder
    httpMock.verify();
  });

  it('debería crearse el servicio con valores iniciales por defecto', () => {
    expect(service).toBeDefined();
    expect(service.metrics()).toBeNull();
    expect(service.recentIncidents()).toEqual([]);
    expect(service.isLoading()).toBe(true); // rxResource inicia cargando de inmediato de forma reactiva
    expect(service.error()).toBeNull();
  });

  it('debería cargar las métricas y los incidentes en paralelo exitosamente', async () => {
    // 1. Avanzamos el reloj de fakeAsync para que rxResource dispare el flujo del stream interno
    service.metrics();
    service.recentIncidents();
    TestBed.tick();

    // 2. Capturamos y respondemos a las dos peticiones HTTP concurrentes (forkJoin)
    const reqMetrics = httpMock.expectOne(`${environment.apiUrl}/dashboard/incidents-metrics`);
    const reqIncidents = httpMock.expectOne(`${environment.apiUrl}/dashboard/recent-incidents`);

    expect(reqMetrics.request.method).toBe('GET');
    expect(reqIncidents.request.method).toBe('GET');

    // Proveemos las respuestas simuladas
    reqMetrics.flush(mockMetrics);
    reqIncidents.flush(mockIncidentsResponse);
    await TestBed.inject(ApplicationRef).whenStable();
    // 3. Forzamos a Angular a correr la detección de cambios / efectos pendientes en las señales
    TestBed.tick();
    // 4. Verificamos que las Computed Signals se hayan actualizado correctamente
    expect(service.metrics()).toEqual(mockMetrics.data);
    expect(service.recentIncidents()).toEqual(mockIncidentsResponse.data);
    expect(service.isLoading()).toBe(false);
    expect(service.error()).toBeNull();
  });

  it('debería disparar una nueva petición al invocar reloadDashboardData()', async () => {
    service.metrics();
    service.recentIncidents();
    TestBed.tick();

    // Respondemos a la carga inicial obligatoria del recurso
    httpMock.expectOne(`${environment.apiUrl}/dashboard/incidents-metrics`).flush(mockMetrics);
    httpMock.expectOne(`${environment.apiUrl}/dashboard/recent-incidents`).flush(mockIncidentsResponse);
    await TestBed.inject(ApplicationRef).whenStable();
    TestBed.tick();

    // Invocamos el método de recarga manual
    service.reloadDashboardData();
    TestBed.tick(); // Procesamos el trigger asíncrono de rxResource.reload()

    // Comprobamos que el recurso volvió a abrir nuevas peticiones HTTP en vuelo
    const reloadedReqMetrics = httpMock.expectOne(`${environment.apiUrl}/dashboard/incidents-metrics`);
    const reloadedReqIncidents = httpMock.expectOne(`${environment.apiUrl}/dashboard/recent-incidents`);

    expect(reloadedReqMetrics).toBeDefined();
    expect(reloadedReqIncidents).toBeDefined();

    // Limpiamos los mocks pendientes de esta recarga
    reloadedReqMetrics.flush(mockMetrics);
    reloadedReqIncidents.flush(mockIncidentsResponse);
    await TestBed.inject(ApplicationRef).whenStable();
    TestBed.tick();
  });
});

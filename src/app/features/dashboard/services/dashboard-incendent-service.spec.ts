import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../core/services/toast-service';
import { DashboardMetricsAPIResponse, RecentIncidentsAPIResponse } from '../models/dashboard-inciendet-model';
import { DashboardIncendentService } from './dashboard-incendent-service';

describe('DashboardIncendentService (Zoneless + rxResource)', () => {
  let httpMock: HttpTestingController;

  const mockToastService = { showSuccess: () => { } };
  const mockMetrics: DashboardMetricsAPIResponse = {
    success: true,
    message: "Metricas",
    data: { total: 85, open: 10, inProgress: 20, closed: 50, criticalCount: 5, byCategory: {} }
  };
  const mockIncidentsResponse: RecentIncidentsAPIResponse = {
    success: true,
    message: "Incidentes",
    data: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        DashboardIncendentService,
        { provide: ToastService, useValue: mockToastService }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
  });

  it('debería cargar las métricas y los incidentes concurrentes exitosamente', async () => {
    const service = TestBed.inject(DashboardIncendentService);

    // Activamos las señales reactivas del recurso caliente
    service.metrics();
    service.recentIncidents();

    // Damos un respiro asíncrono para que se encolen las llamadas en httpMock
    await new Promise(resolve => setTimeout(resolve, 0));

    const reqMetrics = httpMock.expectOne(`${environment.apiUrl}/dashboard/incidents-metrics`);
    const reqIncidents = httpMock.expectOne(`${environment.apiUrl}/dashboard/recent-incidents`);

    expect(reqMetrics.request.method).toBe('GET');
    expect(reqIncidents.request.method).toBe('GET');

    reqMetrics.flush(mockMetrics);
    reqIncidents.flush(mockIncidentsResponse);

    // Esperamos que rxResource finalice el mapeo interno
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(service.isLoading()).toBe(false);
    expect(service.metrics()).toEqual(mockMetrics.data);
    expect(service.recentIncidents()).toEqual(mockIncidentsResponse.data);
  });


});

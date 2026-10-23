import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { DashboardIncendentService } from '../../services/dashboard-incendent-service';
import { StatsIncidentComponent } from './stats-incident.component';

describe('StatsIncidentComponent', () => {
  let component: StatsIncidentComponent;
  let fixture: ComponentFixture<StatsIncidentComponent>;
  let mockDashboardService: any;

  // Mock de las métricas que devuelve tu servicio
  const mockMetrics = {
    total: 10,
    critical: 2,
    high: 3,
    medium: 4,
    low: 1
  };

  beforeEach(async () => {
    mockDashboardService = {
      metrics: signal(mockMetrics)
    };

    await TestBed.configureTestingModule({
      imports: [StatsIncidentComponent],
      providers: [
        { provide: DashboardIncendentService, useValue: mockDashboardService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StatsIncidentComponent);
    component = fixture.componentInstance;

  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy()
  });

  describe('Método getPriorityClass', () => {
    it('debería retornar los estilos CSS correctos para la prioridad CRITICAL', () => {
      const result = component.getPriorityClass('CRITICAL');
      expect(result).toBe('bg-red-100 text-red-800 border-red-200');
    });

    it('debería retornar los estilos CSS correctos para la prioridad HIGH', () => {
      const result = component.getPriorityClass('HIGH');
      expect(result).toBe('bg-orange-100 text-orange-800 border-orange-200');
    });

    it('debería retornar los estilos CSS correctos para la prioridad MEDIUM', () => {
      const result = component.getPriorityClass('MEDIUM');
      expect(result).toBe('bg-yellow-100 text-yellow-800 border-yellow-200');
    });

    it('debería retornar los estilos CSS correctos para la prioridad LOW', () => {
      const result = component.getPriorityClass('LOW');
      expect(result).toBe('bg-green-100 text-green-800 border-green-200');
    });

    it('debería retornar el estilo por defecto gris si la prioridad no existe o es inválida', () => {
      const result = component.getPriorityClass('UNKNOWN_PRIORITY');
      expect(result).toBe('bg-gray-100 text-gray-800');
    });

  });
});

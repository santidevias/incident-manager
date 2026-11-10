import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DashboardIncendentService } from '../../services/dashboard-incendent-service';
import { StatsComponent } from './stats.component';
const jest = vi;

// Mock minimalista en forma de clase para silenciar al hijo que se renderiza dentro del padre
class DashboardIncendentServiceMock {
  dataIsLoaded = signal<boolean>(true);
  metrics = signal({ total: 0, open: 0, inProgress: 0, closed: 0, criticalCount: 0, byCategory: {} });
  recentIncidents = signal([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  reloadDashboardData = jest.fn();
}

describe('StatsComponent (Componente Padre - Zoneless)', () => {
  let component: StatsComponent;
  let fixture: ComponentFixture<StatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsComponent],
      providers: [
        provideZonelessChangeDetection(),
        // Proveemos el mock en el árbol de inyección general para que lo capture StatsIncidentComponent
        { provide: DashboardIncendentService, useClass: DashboardIncendentServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StatsComponent);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

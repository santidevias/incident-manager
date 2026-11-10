import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DashboardIncendentService } from '../../services/dashboard-incendent-service';
import { StatsIncidentComponent } from './stats-incident.component';
const jest = vi;

describe('StatsIncidentComponent (Coverage 100% - Zoneless)', () => {
  let component: StatsIncidentComponent;
  let fixture: ComponentFixture<StatsIncidentComponent>;
  let mockDashboardService: any;

  beforeEach(async () => {
    // Definimos señales controlables de forma dinámica en cada test
    mockDashboardService = {
      metrics: signal(null),
      recentIncidents: signal([]),
      isLoading: signal<boolean>(false),
      error: signal<string | null>(null),
      reloadDashboardData: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [StatsIncidentComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: DashboardIncendentService, useValue: mockDashboardService }
      ]
    });

    TestBed.overrideComponent(StatsIncidentComponent, {
      set: {
        providers: [
          { provide: DashboardIncendentService, useValue: mockDashboardService }
        ]
      }
    });

    await TestBed.compileComponents();
    fixture = TestBed.createComponent(StatsIncidentComponent);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', async () => {
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  // ==========================================
  // COBERTURA DE RAMAS DEL TEMPLATE (HTML)
  // ==========================================
  describe('Template HTML (Estructuras de Control)', () => {

    it('debería mostrar el mensaje de carga cuando isLoading() es true', async () => {
      mockDashboardService.isLoading.set(true);

      fixture.detectChanges();
      await fixture.whenStable();

      const compiled = fixture.nativeElement as HTMLElement;
      const loadingEl = compiled.querySelector('.text-center.p-12');

      expect(loadingEl).toBeTruthy();
      expect(loadingEl?.textContent).toContain('Sincronizando analíticas...');
    });

    it('debería mostrar el banner de error cuando error() tiene un mensaje', async () => {
      mockDashboardService.isLoading.set(false);
      mockDashboardService.error.set('Error crítico simulado');

      fixture.detectChanges();
      await fixture.whenStable();

      const compiled = fixture.nativeElement as HTMLElement;
      const errorEl = compiled.querySelector('.bg-red-50');

      expect(errorEl).toBeTruthy();
      expect(errorEl?.textContent).toContain('Error crítico simulado');
    });

    it('debería pintar los KPI si metrics() contiene datos válidos', async () => {
      mockDashboardService.isLoading.set(false);
      mockDashboardService.error.set(null);
      mockDashboardService.metrics.set({
        total: 100,
        open: 30,
        inProgress: 40,
        closed: 30,
        criticalCount: 10
      });

      fixture.detectChanges();
      await fixture.whenStable();

      const compiled = fixture.nativeElement as HTMLElement;

      // Validamos que se muestren los valores numéricos correspondientes en los contenedores correspondientes
      expect(compiled.innerHTML).toContain('100');
      expect(compiled.innerHTML).toContain('30');
      expect(compiled.innerHTML).toContain('40');
      expect(compiled.innerHTML).toContain('10');
    });

    it('debería mostrar la fila @empty en la tabla cuando no hay incidentes recientes', async () => {
      mockDashboardService.isLoading.set(false);
      mockDashboardService.error.set(null);
      mockDashboardService.recentIncidents.set([]);

      fixture.detectChanges();
      await fixture.whenStable();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.innerHTML).toContain('Todo marcha bien. No hay incidentes urgentes pendientes.');
    });

    it('debería iterar y pintar las filas en el @for cuando recentIncidents contiene datos', async () => {
      mockDashboardService.isLoading.set(false);
      mockDashboardService.error.set(null);
      mockDashboardService.recentIncidents.set([
        { id: 'INC-101', title: 'Fallo de Base de Datos', category: 'Infraestructura', priority: 'CRITICAL' }
      ]);

      fixture.detectChanges();
      await fixture.whenStable();

      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.innerHTML).toContain('INC-101');
      expect(compiled.innerHTML).toContain('Fallo de Base de Datos');
      expect(compiled.innerHTML).toContain('Infraestructura');
    });

    it('debería llamar a reloadDashboardData cuando se hace click en el botón de actualización', async () => {
      mockDashboardService.isLoading.set(false);

      fixture.detectChanges();
      await fixture.whenStable();

      const button = fixture.nativeElement.querySelector('button');
      button.click();

      expect(mockDashboardService.reloadDashboardData).toHaveBeenCalled();
    });
  });

  // ==========================================
  // COBERTURA DE LOGICA (.TS)
  // ==========================================
  describe('Método getPriorityClass y reloadDashboardData', () => {

    it('debería retornar las clases correctas para todas las prioridades mapeadas', () => {
      expect(component.getPriorityClass('CRITICAL')).toBe('bg-red-100 text-red-800 border-red-200');
      expect(component.getPriorityClass('HIGH')).toBe('bg-orange-100 text-orange-800 border-orange-200');
      expect(component.getPriorityClass('MEDIUM')).toBe('bg-yellow-100 text-yellow-800 border-yellow-200');
      expect(component.getPriorityClass('LOW')).toBe('bg-green-100 text-green-800 border-green-200');
    });

    it('debería retornar la clase gris por defecto para una prioridad inexistente o inválida', () => {
      expect(component.getPriorityClass('VALOR_DESCONOCIDO')).toBe('bg-gray-100 text-gray-800');
      expect(component.getPriorityClass('')).toBe('bg-gray-100 text-gray-800');
    });

    it('debería despachar la recarga al servicio desde el método del componente', () => {
      component.reloadDashboardData();
      expect(mockDashboardService.reloadDashboardData).toHaveBeenCalled();
    });
  });
});

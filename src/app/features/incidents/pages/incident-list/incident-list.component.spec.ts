import { computed, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Incident } from '../../models/incident.model';
import { IncidentService } from '../../services/incident.service';
import { IncidentListComponent } from './incident-list.component';

describe('IncidentListComponent (Estándar Senior - Smart Component)', () => {
  let component: IncidentListComponent;
  let fixture: ComponentFixture<IncidentListComponent>;
  let mockIncidentService: any;

  beforeEach(async () => {
    mockIncidentService = {
      incidents: signal<Incident[]>([]),
      loading: signal<boolean>(false),
      searchTerm: signal<string>(''),
      statusFilter: signal<string>('all'),
      priorityFilter: signal<string>('all'),
      sortKey: signal<keyof Incident>('createdAt'),
      sortDirection: signal<'asc' | 'desc'>('desc'),
      currentPage: signal<number>(1),
      pageSize: signal<number>(5),

      processedIncidents: computed(() => []),
      paginatedIncidents: computed(() => []),
      totalPages: computed(() => 1),
      paginationDetails: computed(() => ({ from: 0, to: 0, total: 0 })),

      changeSort: vi.fn(),
      updateSearch: vi.fn(),
      updateStatus: vi.fn(),
      updatePriority: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [IncidentListComponent],
      providers: [
        { provide: IncidentService, useValue: mockIncidentService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentListComponent);
    component = fixture.componentInstance;

    TestBed.tick();
  });

  it('debe inicializar el componente contenedor con éxito', () => {
    expect(component).toBeTruthy();
  });

  // ==========================================
  // PRUEBAS DE INTEGRACIÓN: FLUJO HACIA LOS HIJOS
  // ==========================================
  describe('Flujo de Datos (Del Servicio -> Componente -> DOM)', () => {
    it('debe renderizar los componentes hijos clave en la plantilla', () => {
      fixture.detectChanges();

      const searchChild = fixture.nativeElement.querySelector('[data-testid="child-search"]');
      const tableChild = fixture.nativeElement.querySelector('[data-testid="child-table"]');
      const paginationChild = fixture.nativeElement.querySelector('[data-testid="child-pagination"]');

      expect(searchChild).not.toBeNull();
      expect(tableChild).not.toBeNull();
      expect(paginationChild).not.toBeNull();
    });

    it('debe reflejar el estado correcto de carga (loading) desde las señales del servicio', () => {
      mockIncidentService.loading.set(true);

      TestBed.tick();
      fixture.detectChanges();

      expect(component.incidentsLoading()).toBe(true);
    });
  });

  // ==========================================
  // PRUEBAS DE INTERACCIÓN: REACCIÓN A LOS EVENTOS DE LOS HIJOS
  // ==========================================
  describe('Delegación de Eventos (Event Delegation hacia el Servicio)', () => {
    it('debe delegar la actualización de búsqueda al servicio cuando un hijo la emita', () => {
      const targetQuery = 'Servidor caído';

      // Ejecutamos el método que se activa cuando el hijo (app-incident-search) hace un output
      component['updateSearch'](targetQuery);

      // Verificamos que el componente no procese nada internamente, sino que le pase la orden al servicio
      expect(mockIncidentService.updateSearch).toHaveBeenCalledWith(targetQuery);
    });

    it('debe delegar la actualización del filtro de estado al servicio', () => {
      const targetStatus = 'OPEN';

      component['updateStatus'](targetStatus);

      expect(mockIncidentService.updateStatus).toHaveBeenCalledWith(targetStatus);
    });

    it('debe delegar la orden de ordenamiento (sort) al servicio', () => {
      const targetKey = 'priority';

      component['changeSort'](targetKey);

      expect(mockIncidentService.changeSort).toHaveBeenCalledWith(targetKey);
    });

    it('debe actualizar de forma local e interna la señal de paginación del servicio', () => {
      const targetPage = 3;

      component.setPage(targetPage);

      // Validamos que el método setPage manipule de manera exitosa la señal del paginador
      expect(mockIncidentService.currentPage()).toBe(targetPage);
    });

    it('debe imprimir en consola los detalles del incidente al ejecutar viewDetails', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const mockId = 'inc-123';

      component.viewDetails(mockId);

      expect(consoleSpy).toHaveBeenCalledWith('Ver detalles del incidente:', mockId);
    });
  });
});

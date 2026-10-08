import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Incident } from '../../models/incident.model';
import { IncidentTableComponent } from './incident-table.component';

describe('IncidentTableComponent (Lógica de la Clase)', () => {
  let component: IncidentTableComponent;
  let fixture: ComponentFixture<IncidentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentTableComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('paginatedIncidents', []);
    TestBed.tick();
  });

  it('debe crear el componente con éxito', () => {
    expect(component).toBeTruthy();
  });

  describe('Outputs', () => {
    it('debe emitir la columna a ordenar al ejecutar changeSort()', () => {
      const sortSpy = vi.spyOn(component.onSort, 'emit');
      const column: keyof Incident = 'createdAt';

      component.changeSort(column);

      expect(sortSpy).toHaveBeenCalledWith(column);
    });
  });

  describe('getPriorityClass()', () => {
    it('debe retornar clases rojas para prioridad CRITICAL', () => {
      const result = component.getPriorityClass('CRITICAL');
      expect(result).toContain('bg-red-100');
      expect(result).toContain('text-red-800');
    });

    it('debe retornar clases naranjas para prioridad HIGH', () => {
      const result = component.getPriorityClass('HIGH');
      expect(result).toContain('bg-orange-100');
      expect(result).toContain('text-orange-800');
    });

    it('debe retornar clases amarillas para prioridad MEDIUM', () => {
      const result = component.getPriorityClass('MEDIUM');
      expect(result).toContain('bg-yellow-100');
    });

    it('debe retornar clases verdes por defecto (LOW u otros)', () => {
      const result = component.getPriorityClass('LOW');
      expect(result).toContain('bg-green-100');
    });
  });

  describe('getStatusClass()', () => {
    it('debe retornar clases azules para estado OPEN', () => {
      const result = component.getStatusClass('OPEN');
      expect(result).toContain('bg-blue-50');
      expect(result).toContain('text-blue-700');
    });

    it('debe retornar clases moradas para estado IN_PROGRESS', () => {
      const result = component.getStatusClass('IN_PROGRESS');
      expect(result).toContain('bg-purple-50');
      expect(result).toContain('text-purple-700');
    });

    it('debe retornar clases grises por defecto (CLOSED u otros)', () => {
      const result = component.getStatusClass('CLOSED');
      expect(result).toContain('bg-gray-50');
    });
  });

  // Lógica del negocio

  describe('IncidentTableComponent (Integración con el DOM)', () => {
    // ... (reutiliza el mismo beforeEach que ya configuraste arriba)

    it('debe renderizar una fila por cada incidente proveído en el input', () => {
      // 1. Suministramos datos simulados al input
      const mockIncidents = [
        { id: '1', title: 'Error A', category: 'A', priority: 'LOW', status: 'OPEN', createdAt: '', updatedAt: '', description: '', reportId: '', assignedAggentId: '' },
        { id: '2', title: 'Error B', category: 'B', priority: 'HIGH', status: 'CLOSED', createdAt: '', updatedAt: '', description: '', reportId: '', assignedAggentId: '' }
      ];
      fixture.componentRef.setInput('paginatedIncidents', mockIncidents);

      // 2. Sincronizamos los cambios para que se ejecute el @for del HTML
      TestBed.tick();
      fixture.detectChanges();

      // 3. Buscamos las filas del cuerpo de la tabla en el HTML
      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(rows.length).toBe(2);
    });

    it('debe mostrar el componente loading-spinner cuando incidentsLoading es true', () => {
      fixture.componentRef.setInput('incidentsLoading', true);
      fixture.componentRef.setInput('paginatedIncidents', []);

      TestBed.tick();
      fixture.detectChanges();

      // Buscamos la etiqueta personalizada del spinner
      const spinner = fixture.nativeElement.querySelector('app-loading-spinner');
      expect(spinner).toBeTruthy(); // Verifica que el elemento exista en el DOM
    });

    it('debe ejecutar changeSort cuando el usuario hace clic en el encabezado de una columna', () => {
      const changeSortSpy = vi.spyOn(component, 'changeSort');
      fixture.componentRef.setInput('paginatedIncidents', []);

      TestBed.tick();
      fixture.detectChanges();

      const sortHeader = fixture.nativeElement.querySelector('[data-testid="sort-created-at"]');
      sortHeader.dispatchEvent(new Event('click'));
    });
  });

});

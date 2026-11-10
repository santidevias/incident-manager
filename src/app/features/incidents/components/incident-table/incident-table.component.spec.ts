import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Incident } from '../../models/incident.model';
import { IncidentTableComponent } from './incident-table.component';

const jest = vi;

describe('IncidentTableComponent (Lógica e Integración Zoneless)', () => {
  let component: IncidentTableComponent;
  let fixture: ComponentFixture<IncidentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentTableComponent);
    component = fixture.componentInstance;

    // Inicialización explícita obligatoria del input required
    fixture.componentRef.setInput('paginatedIncidents', []);
    fixture.detectChanges();
  });

  it('debe crear el componente con éxito', () => {
    expect(component).toBeTruthy();
  });

  describe('Outputs y Métodos de Clase', () => {
    it('debe emitir la columna a ordenar al ejecutar changeSort()', () => {
      const sortSpy = jest.spyOn(component.onSort, 'emit');
      const column: keyof Incident = 'createdAt';

      component.changeSort(column);

      expect(sortSpy).toHaveBeenCalledWith(column);
    });

    it('debe emitir el identificador del incidente al ejecutar viewDetails()', () => {
      const detailsSpy = jest.spyOn(component.onViewDetails, 'emit');
      const id = 'INC-1234';

      component.viewDetails(id);

      expect(detailsSpy).toHaveBeenCalledWith(id);
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

  describe('Integración con el DOM y Plantilla HTML', () => {
    it('debe renderizar una fila por cada incidente proveído en el input', async () => {
      const mockIncidents = [
        { id: '1', title: 'Error A', category: 'A', priority: 'CRITICAL', status: 'OPEN', createdAt: '2026-11-09', updatedAt: '', description: '', reportId: '', assignedAgentId: '' },
        { id: '2', title: 'Error B', category: 'B', priority: 'MEDIUM', status: 'IN_PROGRESS', createdAt: '2026-11-09', updatedAt: '', description: '', reportId: '', assignedAgentId: '' }
      ];
      fixture.componentRef.setInput('paginatedIncidents', mockIncidents);

      await Promise.resolve();
      fixture.detectChanges();

      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(rows.length).toBe(2);
    });

    it('debe mostrar el componente loading-spinner cuando incidentsLoading es true y no hay registros', async () => {
      fixture.componentRef.setInput('incidentsLoading', true);
      fixture.componentRef.setInput('paginatedIncidents', []);

      await Promise.resolve();
      fixture.detectChanges();

      const spinner = fixture.nativeElement.querySelector('app-loading-spinner');
      expect(spinner).toBeTruthy();
    });

    it('debe mostrar el mensaje informativo alternativo cuando no hay carga ni registros en la lista', async () => {
      fixture.componentRef.setInput('incidentsLoading', false);
      fixture.componentRef.setInput('paginatedIncidents', []);

      await Promise.resolve();
      fixture.detectChanges();

      const cellText = fixture.nativeElement.querySelector('tbody td').textContent;
      expect(cellText).toContain('No se encontraron incidentes registrados de momento.');
    });

    it('debe ejecutar changeSort cuando el usuario hace clic en el encabezado de una columna', async () => {
      const changeSortSpy = jest.spyOn(component, 'changeSort');

      const sortHeader = fixture.nativeElement.querySelector('[data-testid="sort-created-at"]');
      sortHeader.dispatchEvent(new Event('click'));

      await Promise.resolve();
      expect(changeSortSpy).toHaveBeenCalledWith('createdAt');
    });

    it('debe ejecutar viewDetails al presionar el botón Gestionar en la fila', async () => {
      const viewDetailsSpy = jest.spyOn(component, 'viewDetails');
      const mockIncidents = [
        { id: '99', title: 'Error C', category: 'C', priority: 'LOW', status: 'CLOSED', createdAt: '2026-11-09', updatedAt: '', description: '', reportId: '', assignedAgentId: '' }
      ];
      fixture.componentRef.setInput('paginatedIncidents', mockIncidents);

      await Promise.resolve();
      fixture.detectChanges();

      const manageButton = fixture.nativeElement.querySelector('tbody button');
      manageButton.dispatchEvent(new Event('click'));

      expect(viewDetailsSpy).toHaveBeenCalledWith('99');
    });

    // =========================================================
    // COBERTURA COMPLEMENTARIA: ESTRUCTURAS @if DE ORDENAMIENTO
    // =========================================================
    it('debe renderizar el carácter ▲ cuando la columna coincide y la dirección es asc', async () => {
      fixture.componentRef.setInput('sortKey', 'id');
      fixture.componentRef.setInput('sortDirection', 'asc');

      await Promise.resolve();
      fixture.detectChanges();

      const idHeader = fixture.nativeElement.querySelector('[data-testid="sort-id"]');
      expect(idHeader.textContent).toContain('▲');
      expect(idHeader.textContent).not.toContain('▼');
    });

    it('debe renderizar el carácter ▼ cuando la columna coincide y la dirección es desc', async () => {
      fixture.componentRef.setInput('sortKey', 'title');
      fixture.componentRef.setInput('sortDirection', 'desc');

      await Promise.resolve();
      fixture.detectChanges();

      const titleHeader = fixture.nativeElement.querySelector('[data-testid="sort-title"]');
      expect(titleHeader.textContent).toContain('▼');
      expect(titleHeader.textContent).not.toContain('▲');
    });
  });
});

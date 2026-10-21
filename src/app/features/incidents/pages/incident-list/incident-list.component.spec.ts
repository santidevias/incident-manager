import { computed, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../../../../core/services/auth.service';
import { Incident } from '../../models/incident.model';
import { IncidentService } from '../../services/incident.service';
import { ModalService } from '../../services/modal-service';
import { IncidentListComponent } from './incident-list.component';

describe('IncidentListComponent (Estándar Senior - Smart Component)', () => {
  let component: IncidentListComponent;
  let fixture: ComponentFixture<IncidentListComponent>;
  let mockIncidentService: any;
  let mockAuthService: any;
  let mockModalService: any;

  // Objeto base para pruebas de guardado y borrado
  const dummyIncident: Incident = {
    id: 'inc-123',
    title: 'Error de Login',
    description: 'Descripción',
    category: 'Seguridad',
    priority: 'HIGH',
    status: 'OPEN',
    reportId: 'usr-120',
    assignedAgentId: 'agt-200',
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-01T19:52:00.000Z'
  };

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
      selectedIncident: signal<Incident | undefined>(undefined),

      changeSort: vi.fn(),
      updateSearch: vi.fn(),
      updateStatus: vi.fn(),
      updatePriority: vi.fn(),
      setIncident: vi.fn(),
      updateIncidentList: vi.fn(),
      deleteIncidentList: vi.fn()
    };

    mockAuthService = {
      role: signal<string>('admin'),
      currentUser: signal<any>({ id: 'usr-120', name: 'Test User' })
    };

    mockModalService = {
      isOpen: signal<boolean>(false),
      open: vi.fn(),
      close: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [IncidentListComponent],
      providers: [
        { provide: IncidentService, useValue: mockIncidentService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ModalService, useValue: mockModalService }
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

      component['updateSearch'](targetQuery);

      expect(mockIncidentService.updateSearch).toHaveBeenCalledWith(targetQuery);
    });

    it('debe delegar la actualización del filtro de estado al servicio', () => {
      const targetStatus = 'OPEN';

      component['updateStatus'](targetStatus);

      expect(mockIncidentService.updateStatus).toHaveBeenCalledWith(targetStatus);
    });

    it('debe delegar la actualización del filtro de prioridad al servicio', () => {
      const targetPriority = 'HIGH';

      component['updatePriority'](targetPriority);

      expect(mockIncidentService.updatePriority).toHaveBeenCalledWith(targetPriority);
    });

    it('debe delegar la orden de ordenamiento (sort) al servicio', () => {
      const targetKey = 'priority';

      component['changeSort'](targetKey);

      expect(mockIncidentService.changeSort).toHaveBeenCalledWith(targetKey);
    });

    it('debe actualizar de forma local e interna la señal de paginación del servicio', () => {
      const targetPage = 3;

      component.setPage(targetPage);

      expect(mockIncidentService.currentPage()).toBe(targetPage);
    });
  });

  // ==========================================
  // PRUEBAS DE CONTROL: CONTROL DE MODALES Y FLUJOS CRUD
  // ==========================================
  describe('Gestión de Detalles y Modales (Nuevos Métodos)', () => {

    it('debe seleccionar el incidente y abrir el modal al ejecutar viewDetails', () => {
      const mockId = 'inc-123';

      // Act
      component.viewDetails(mockId);

      // Assert: Validamos que delegue la selección y abra el modal
      expect(mockIncidentService.setIncident).toHaveBeenCalledWith(mockId);
      expect(mockModalService.open).toHaveBeenCalled();
    });

    it('debe abrir el modal de servicio al ejecutar openModal', () => {
      // Act
      component.openModal();

      // Assert
      expect(mockModalService.open).toHaveBeenCalled();
    });

    it('debe guardar el incidente, actualizar la lista y cerrar el modal al ejecutar onSave', () => {
      // Creamos un espía del método interno modalClose del componente
      const modalCloseSpy = vi.spyOn(component, 'modalClose');

      // Act
      component.onSave(dummyIncident);

      // Assert: Verifica que envíe los datos al servicio y limpie el estado del modal
      expect(mockIncidentService.updateIncidentList).toHaveBeenCalledWith(dummyIncident);
      expect(modalCloseSpy).toHaveBeenCalled();
    });

    it('debe borrar el incidente, actualizar la lista y cerrar el modal al ejecutar onDelete', () => {
      const modalCloseSpy = vi.spyOn(component, 'modalClose');

      // Act
      component.onDelete(dummyIncident);

      // Assert: Pasa el ID al servicio para remover el incidente y limpia el modal
      expect(mockIncidentService.deleteIncidentList).toHaveBeenCalledWith(dummyIncident.id);
      expect(modalCloseSpy).toHaveBeenCalled();
    });

    it('debe limpiar el incidente seleccionado y cerrar el modal al ejecutar modalClose', () => {
      // Act
      component.modalClose();

      // Assert: Verifica la limpieza del estado tanto en el servicio de incidentes como en el del modal
      expect(mockIncidentService.setIncident).toHaveBeenCalledWith('');
      expect(mockModalService.close).toHaveBeenCalled();
    });
  });
});

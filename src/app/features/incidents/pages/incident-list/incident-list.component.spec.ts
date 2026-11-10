import { computed, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast-service';
import { Incident } from '../../models/incident.model';
import { IncidentService } from '../../services/incident.service';
import { ModalService } from '../../services/modal-service';
import { IncidentListComponent } from './incident-list.component';

const jest = vi;

describe('IncidentListComponent (Cobertura Absoluta 100% - HTML & TS)', () => {
  let component: IncidentListComponent;
  let fixture: ComponentFixture<IncidentListComponent>;
  let mockIncidentService: any;
  let mockAuthService: any;
  let mockModalService: any;
  let mockToastService: any;

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

      changeSort: jest.fn(),
      updateSearch: jest.fn(),
      updateStatus: jest.fn(),
      updatePriority: jest.fn(),
      setIncident: jest.fn(),
      updateIncidentList: jest.fn(),
      deleteIncidentList: jest.fn()
    };

    mockAuthService = {
      role: signal<string>('admin'),
      currentUser: signal<any>({ id: 'usr-120', name: 'Test User' })
    };

    mockModalService = {
      isOpen: signal<boolean>(false),
      open: jest.fn(),
      close: jest.fn()
    };

    mockToastService = {
      showSuccess: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [IncidentListComponent],
      providers: [
        { provide: IncidentService, useValue: mockIncidentService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ModalService, useValue: mockModalService },
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente con éxito', () => {
    expect(component).toBeTruthy();
  });

  // =========================================================
  // COBERTURA CRÍTICA: DISPAROS DESDE EL HTML (FILTROS Y TABLA)
  // =========================================================
  describe('Interacción desde la Plantilla HTML (Subida del Porcentaje en Stmts y Funcs)', () => {

    it('debe activar updateSearch() cuando el componente app-incident-search emita onUpdateSearch', async () => {
      const searchDebugEl = fixture.debugElement.query(By.css('[data-testid="child-search"]'));
      const queryText = 'Fallo crítico de memoria';

      // Disparamos la emisión simulando el comportamiento del Output nativo en la plantilla
      searchDebugEl.triggerEventHandler('onUpdateSearch', queryText);

      await Promise.resolve();
      expect(mockIncidentService.updateSearch).toHaveBeenCalledWith(queryText);
    });

    it('debe activar updateStatus() cuando el componente app-incident-filter-status emita onUpdateStatus', async () => {
      const statusDebugEl = fixture.debugElement.query(By.css('[data-testid="child-status"]'));
      const statusValue = 'IN_PROGRESS';

      statusDebugEl.triggerEventHandler('onUpdateStatus', statusValue);

      await Promise.resolve();
      expect(mockIncidentService.updateStatus).toHaveBeenCalledWith(statusValue);
    });

    it('debe activar updatePriority() cuando el componente app-incident-filter-priority emita onUpdatePriority', async () => {
      const priorityDebugEl = fixture.debugElement.query(By.css('[data-testid="child-priority"]'));
      const priorityValue = 'CRITICAL';

      priorityDebugEl.triggerEventHandler('onUpdatePriority', priorityValue);

      await Promise.resolve();
      expect(mockIncidentService.updatePriority).toHaveBeenCalledWith(priorityValue);
    });

    it('debe activar changeSort() cuando el componente app-incident-table emita onSort', async () => {
      const tableDebugEl = fixture.debugElement.query(By.css('[data-testid="child-table"]'));
      const columnKey = 'title';

      tableDebugEl.triggerEventHandler('onSort', columnKey);

      await Promise.resolve();
      expect(mockIncidentService.changeSort).toHaveBeenCalledWith(columnKey);
    });

    it('debe activar viewDetails() cuando el componente app-incident-table emita onViewDetails', async () => {
      const tableDebugEl = fixture.debugElement.query(By.css('[data-testid="child-table"]'));
      const mockId = 'inc-999';

      tableDebugEl.triggerEventHandler('onViewDetails', mockId);

      await Promise.resolve();
      expect(mockIncidentService.setIncident).toHaveBeenCalledWith(mockId);
      expect(mockModalService.open).toHaveBeenCalled();
    });

    it('debe activar setPage() cuando el componente app-incident-pagination emita onSetPage', async () => {
      const paginationDebugEl = fixture.debugElement.query(By.css('[data-testid="child-pagination"]'));

      paginationDebugEl.triggerEventHandler('onSetPage', 4);

      await Promise.resolve();
      expect(mockIncidentService.currentPage()).toBe(4);
    });

    it('debe abrir el modal al hacer clic en el botón físico del HTML', async () => {
      const button = fixture.nativeElement.querySelector('button');
      button.dispatchEvent(new Event('click'));

      await Promise.resolve();
      expect(mockModalService.open).toHaveBeenCalled();
    });
  });

  // =========================================================
  // COBERTURA CRÍTICA: EVENTOS DEL MODAL INTERNO @if(isOpen)
  // =========================================================
  describe('Interacciones con los Eventos del Modal Formulario', () => {

    beforeEach(async () => {
      // Forzamos la apertura para renderizar el bloque modal en el HTML
      mockModalService.isOpen.set(true);
      await Promise.resolve();
      fixture.detectChanges();
    });

    it('debe disparar onSave() directamente desde el evento (onSave) del HTML del modal', async () => {
      const modalDebugEl = fixture.debugElement.query(By.css('app-incident-modal-form'));
      const modalCloseSpy = jest.spyOn(component, 'modalClose');

      modalDebugEl.triggerEventHandler('onSave', dummyIncident);

      await Promise.resolve();
      expect(mockIncidentService.updateIncidentList).toHaveBeenCalledWith(dummyIncident);
      expect(mockToastService.showSuccess).toHaveBeenCalledWith('Actualización de incidente con éxito!');
      expect(modalCloseSpy).toHaveBeenCalled();
    });

    it('debe disparar onDelete() directamente desde el evento (onDelete) del HTML del modal', async () => {
      const modalDebugEl = fixture.debugElement.query(By.css('app-incident-modal-form'));
      const modalCloseSpy = jest.spyOn(component, 'modalClose');

      modalDebugEl.triggerEventHandler('onDelete', dummyIncident);

      await Promise.resolve();
      expect(mockIncidentService.deleteIncidentList).toHaveBeenCalledWith(dummyIncident.id);
      expect(modalCloseSpy).toHaveBeenCalled();
    });

    it('debe disparar modalClose() directamente desde el evento (onClose) del HTML del modal', async () => {
      const modalDebugEl = fixture.debugElement.query(By.css('app-incident-modal-form'));

      modalDebugEl.triggerEventHandler('onClose', null);

      await Promise.resolve();
      expect(mockIncidentService.setIncident).toHaveBeenCalledWith('');
      expect(mockModalService.close).toHaveBeenCalled();
    });
  });

  // ==========================================
  // FLUJOS DE SEÑALES REACTIVAS PURE-TS
  // ==========================================
  describe('Sincronización del Estado de Señales', () => {
    it('debe reflejar variaciones asíncronas en la señal de loading', async () => {
      mockIncidentService.loading.set(true);
      await Promise.resolve();
      fixture.detectChanges();
      expect(component.incidentsLoading()).toBe(true);
    });
  });
});

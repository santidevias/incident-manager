import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { beforeEach, describe, expect, it } from 'vitest';
import { User, UserRole } from '../../../../core/models/auth.model';
import { ProfileService } from '../../../../core/services/profile-service';
import { Incident } from '../../models/incident.model';
import { CategoryService } from '../../services/category-service';
import { IncidentFormService } from '../../services/incident-form-service';
import { IncidentModalFormComponent } from './incident-modal-form.component';
const jest = vi;

describe('IncidentModalFormComponent', () => {
  let component: IncidentModalFormComponent;
  let fixture: ComponentFixture<IncidentModalFormComponent>;

  // Mocks de los Servicios Inyectados
  let mockProfileService: any;
  let mockCategoryService: any;
  let mockFormService: any;

  const mockUser: User = { id: 'usr-100', name: 'Usuario Prueba', role: 'ADMIN' as UserRole, agentId: "agt-200", email: "support@ias.com.co" };
  const mockAgent = { id: 'agt-200', name: 'Agente Asignado' };

  const mockIncident: Incident = {
    id: 'inc-123',
    title: 'Fallo de red',
    description: 'Se cae la red en el momento de ingresar al login',
    category: 'Infraestructura',
    priority: 'HIGH',
    status: 'OPEN',
    reportId: 'usr-100',
    assignedAgentId: 'agt-200',
  } as unknown as Incident;

  beforeEach(async () => {
    // Configuramos el comportamiento por defecto de las señales de los servicios
    mockProfileService = {
      assignedAgents: signal([mockAgent]),
      users: signal([mockUser]),
    };

    mockCategoryService = {
      categories: signal([{ id: 'cat-1', name: 'Soporte TI' }]),
    };

    mockFormService = {
      buildForm: jest.fn().mockImplementation((role, incident) => {
        return new FormGroup({
          id: new FormControl(incident?.id ?? ''),
          title: new FormControl(incident?.title ?? '', Validators.required),
          description: new FormControl(incident?.description ?? '', Validators.required),
          category: new FormControl(incident?.category ?? '', Validators.required),
          priority: new FormControl(incident?.priority ?? '', Validators.required),
          status: new FormControl(incident?.status ?? '', Validators.required),
          reportId: new FormControl(incident?.reportId ?? ''),
          assignedAgentId: new FormControl(incident?.assignedAgentId ?? ''),
          createdAt: new FormControl(incident?.createdAt ?? ''),
          updatedAt: new FormControl(incident?.updatedAt ?? ''),
        });
      }),
    };

    await TestBed.configureTestingModule({
      imports: [IncidentModalFormComponent],
      providers: [
        { provide: ProfileService, useValue: mockProfileService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: IncidentFormService, useValue: mockFormService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentModalFormComponent);
    component = fixture.componentInstance;

    // Seteo de los inputs obligatorios mínimos usando componentRef.setInput
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('currentRole', 'admin' as UserRole);
    fixture.componentRef.setInput('currentUser', mockUser);

  });

  it('debe inicializar el componente de forma correcta', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.isEdit).toBe(false);
  });

  describe('Ciclo de Vida e Inicialización (ngOnInit)', () => {
    it('debe establecer isEdit en false cuando no se proporciona un incidente para editar', () => {
      fixture.componentRef.setInput('incidentToEdit', undefined);
      component.ngOnInit();
      expect(component.isEdit).toBe(false);
      expect(mockFormService.buildForm).toHaveBeenCalledWith('admin', undefined);
    });

    it('debe establecer isEdit en true y construir el formulario con los datos cargados', () => {
      fixture.componentRef.setInput('incidentToEdit', mockIncident);
      component.ngOnInit();
      expect(component.isEdit).toBe(true);
      expect(mockFormService.buildForm).toHaveBeenCalledWith('admin', mockIncident);
    });
  });

  describe('Interacciones y Emisiones de Eventos (Outputs)', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('incidentToEdit', mockIncident);
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('debe emitir onSave con los valores del formulario al hacer submit si es válido', () => {
      const saveSpy = jest.spyOn(component['onSave'], 'emit');

      component.form.patchValue({
        title: 'Nuevo título de error masivo',
        description: 'Detalle del problema de infraestructura'
      });

      component.onSubmit();

      expect(saveSpy).toHaveBeenCalledWith(component.form.getRawValue());
    });

    it('no debe emitir onSave si el formulario tiene campos inválidos', () => {
      const saveSpy = jest.spyOn(component['onSave'], 'emit');
      component.form.get('title')?.setValue(''); // Forzamos error de validación obligatoria

      component.onSubmit();

      expect(saveSpy).not.toHaveBeenCalled();
    });

    it('debe emitir onDelete con la data del formulario al ejecutar la acción de borrado', () => {
      const deleteSpy = jest.spyOn(component['onDelete'], 'emit');

      component.delete();

      expect(deleteSpy).toHaveBeenCalledWith(component.form.getRawValue());
    });

    it('debe actualizar una propiedad específica del formulario usando patchValue al ejecutar onSelected', () => {
      const recordDummy = { id: 'cat-modificada', name: 'Nueva Categoria' };

      component.onSelected(recordDummy, 'category');

      expect(component.form.get('category')?.value).toBe('cat-modificada');
    });
  });

  describe('Cómputos Reactivos y Propiedades Calculadas (Signals)', () => {
    it('debe mapear el nombre del agente seleccionado si el ID coincide en el ProfileService', () => {
      fixture.componentRef.setInput('incidentToEdit', mockIncident);
      fixture.detectChanges();

      expect(component.agentSelected()).toBe('Agente Asignado');
    });

    it('debe retornar null en agentSelected si el incidente no cuenta con assignedAgentId', () => {
      const incidentSinAgente = { ...mockIncident, assignedAgentId: undefined };
      fixture.componentRef.setInput('incidentToEdit', incidentSinAgente);
      fixture.detectChanges();

      expect(component.agentSelected()).toBeNull();
    });

    it('debe retornar null en agentSelected si el ID no se localiza dentro de la señal global', () => {
      const incidentAgenteInvalido = { ...mockIncident, assignedAgentId: 'id-desconocido-99' };
      fixture.componentRef.setInput('incidentToEdit', incidentAgenteInvalido);
      fixture.detectChanges();

      expect(component.agentSelected()).toBeNull();
    });

    it('debe resolver el nombre del reportero usando el reportId del incidente bajo modo edición', () => {
      fixture.componentRef.setInput('incidentToEdit', mockIncident);
      fixture.detectChanges();

      expect(component.userSelected()).toBe('Usuario Prueba');
    });

    it('debe usar el ID del usuario actual de la sesión si el incidente no tiene un reportId explícito', () => {
      const incidentSinReportero = { ...mockIncident, reportId: undefined };
      fixture.componentRef.setInput('incidentToEdit', incidentSinReportero);
      fixture.detectChanges();

      expect(component.userSelected()).toBe('Usuario Prueba');
    });

    it('debe retornar null en userSelected si no se cuenta con reportId ni sesión activa de usuario', () => {
      fixture.componentRef.setInput('currentUser', null);
      const incidentVacio = { ...mockIncident, reportId: undefined };
      fixture.componentRef.setInput('incidentToEdit', incidentVacio);
      fixture.detectChanges();

      expect(component.userSelected()).toBeNull();
    });

    it('debe retornar null en userSelected si el identificador no existe en el listado del servicio', () => {
      const incidentUsuarioDesconocido = { ...mockIncident, reportId: 'anonimo-123' };
      fixture.componentRef.setInput('incidentToEdit', incidentUsuarioDesconocido);
      fixture.detectChanges();

      expect(component.userSelected()).toBeNull();
    });
  });

  describe('Comportamiento y Renderizado del DOM (HTML)', () => {
    it('no debe pintar ningún contenedor o backdrop si la señal isOpen es false', async () => {
      fixture.componentRef.setInput('isOpen', false);
      await Promise.resolve();
      fixture.detectChanges();

      const modalDiv = fixture.nativeElement.querySelector('.fixed');
      expect(modalDiv).toBeNull();
    });

    it('debe renderizar el botón de borrado exclusivamente si se encuentra en modo edición y es Admin', async () => {
      fixture.componentRef.setInput('incidentToEdit', mockIncident);
      fixture.componentRef.setInput('currentRole', 'admin' as UserRole);
      component.ngOnInit();

      await Promise.resolve();
      fixture.detectChanges();

      const deleteBtn = fixture.nativeElement.querySelector('button[type="button"].bg-red-50');
      expect(deleteBtn).not.toBeNull();
    });

    it('debe ocultar el botón de borrado en el pie de página si el usuario actual no posee rol de administrador', async () => {
      fixture.componentRef.setInput('incidentToEdit', mockIncident);
      fixture.componentRef.setInput('currentRole', 'requester' as UserRole);
      component.ngOnInit();

      await Promise.resolve();
      fixture.detectChanges();

      const deleteBtn = fixture.nativeElement.querySelector('button[type="button"].bg-red-50');
      expect(deleteBtn).toBeNull();
    });

    it('debe disparar la emisión de onClose directamente cuando el usuario cliquee el botón Cancelar', async () => {
      const closeSpy = jest.spyOn(component['onClose'], 'emit');
      fixture.componentRef.setInput('incidentToEdit', mockIncident);
      component.ngOnInit();

      await Promise.resolve();
      fixture.detectChanges();

      // Ubicamos el botón de cancelar por su contenido en texto
      const botones = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
      const btnCancelar = botones.find(b => b.textContent?.trim() === 'Cancelar');

      btnCancelar?.dispatchEvent(new Event('click'));

      expect(closeSpy).toHaveBeenCalled();
    });
  });
});


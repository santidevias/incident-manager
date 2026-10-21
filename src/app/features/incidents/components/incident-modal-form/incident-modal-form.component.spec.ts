import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { User, UserRole } from '../../../../core/models/auth.model';
import { Selectable } from '../../../../core/models/selectable.model';
import { ProfileService } from '../../../../core/services/profile-service';
import { Incident } from '../../models/incident.model';
import { CategoryService } from '../../services/category-service';
import { IncidentFormService } from '../../services/incident-form-service';
import { IncidentModalFormComponent } from './incident-modal-form.component';

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
      buildForm: vi.fn().mockImplementation((role, incident) => {
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

  it('debería inicializarse correctamente creando el formulario', () => {
    fixture.detectChanges(); // Ejecuta ngOnInit

    expect(component).toBeTruthy();
    expect(mockFormService.buildForm).toHaveBeenCalledWith('admin', undefined);
    expect(component.isEdit).toBe(false);
  });

  it('debería detectar modo edición si se proporciona un incidente para editar', () => {
    fixture.componentRef.setInput('incidentToEdit', mockIncident);
    fixture.detectChanges();

    // En tu código: "this.isEdit = !!this.incidentToEdit;" (evalúa la señal o el input según tu ngOnInit actual)
    expect(mockFormService.buildForm).toHaveBeenCalledWith('admin', mockIncident);
  });

  describe('Computeds y Reactividad', () => {
    it('debería calcular agentSelected correctamente si el incidente tiene un agente asignado coincidente', () => {
      fixture.componentRef.setInput('incidentToEdit', mockIncident);
      fixture.detectChanges();

      expect(component.agentSelected()).toBe('Agente Asignado');
    });

    it('debería retornar null en agentSelected si no hay incidente o ID asignado', () => {
      fixture.componentRef.setInput('incidentToEdit', undefined);
      fixture.detectChanges();

      expect(component.agentSelected()).toBeNull();
    });

    it('debería calcular userSelected basado en el reporte del incidente', () => {
      fixture.componentRef.setInput('incidentToEdit', mockIncident);
      fixture.detectChanges();

      expect(component.userSelected()).toBe('Usuario Prueba');
    });

    it('debería calcular userSelected basado en currentUser si no se edita ningún incidente', () => {
      fixture.componentRef.setInput('incidentToEdit', undefined);
      fixture.componentRef.setInput('currentUser', mockUser);
      fixture.detectChanges();

      expect(component.userSelected()).toBe('Usuario Prueba');
    });

  });

  describe('Interacciones y Métodos', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería actualizar un campo específico del formulario mediante onSelected', () => {
      const selectableItem: Selectable = { id: 'CLOSED', name: 'Resuelto' };

      component.onSelected(selectableItem, 'status');

      expect(component.form.get('status')?.value).toBe('CLOSED');
    });

    it('debería emitir onSave en onSubmit si el formulario pasa las validaciones de consistencia', () => {
      const spySave = vi.spyOn((component as any).onSave, 'emit');

      // Rellenamos el título para volver el Form válido
      component.form.patchValue({
        id: 'inc-123',
        title: 'Fallo de red',
        description: 'Se cae la red en el momento de ingresar al login',
        category: 'Infraestructura',
        priority: 'HIGH',
        status: 'OPEN',
        reportId: 'usr-100',
        assignedAgentId: 'agt-200',
      });

      component.onSubmit();

      expect(spySave).toHaveBeenCalledWith(component.form.getRawValue());
    });

    it('no debería emitir onSave en onSubmit si el formulario contiene campos inválidos', () => {
      const spySave = vi.spyOn((component as any).onSave, 'emit');

      // Dejamos el título vacío para mantenerlo inválido
      fixture.detectChanges()
      component.form.patchValue({ title: '' });
      fixture.detectChanges()
      component.onSubmit();

      expect(spySave).not.toHaveBeenCalled();
    });

    it('debería emitir onDelete con los datos limpios actuales del formulario', () => {
      const spyDelete = vi.spyOn((component as any).onDelete, 'emit');
      fixture.detectChanges()
      component.form.patchValue({ id: 'inc-123', title: 'Incidente a borrar' });
      fixture.detectChanges()
      component.delete();

      expect(spyDelete).toHaveBeenCalledWith(component.form.getRawValue());
    });

  });
  describe('Renderizado e Interacciones del HTML', () => {
    it('no debería renderizar absolutamente nada en el DOM si isOpen es false', () => {
      fixture.componentRef.setInput('isOpen', false);
      fixture.detectChanges();

      // Intentamos buscar el contenedor del modal
      const modalContainer = fixture.nativeElement.querySelector('.fixed');
      expect(modalContainer).toBeNull();
    });

    it('debería mostrar el título "Crear Incidente" cuando isEdit es false', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.componentRef.setInput('incidentToEdit', undefined);
      fixture.detectChanges();

      const titleElement = fixture.nativeElement.querySelector('h2');
      expect(titleElement.textContent).toContain('Crear Incidente');
    });

    it('debería mostrar el título "Editar Incidente" cuando se pasa un incidente para editar', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.componentRef.setInput('incidentToEdit', mockIncident);
      fixture.detectChanges();

      const titleElement = fixture.nativeElement.querySelector('h2');
      expect(titleElement.textContent).toContain('Editar Incidente');
    });

    it('debería renderizar el selector de agentes UNICAMENTE si el rol es ADMIN', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.componentRef.setInput('currentRole', 'admin' as UserRole);
      fixture.detectChanges();

      // Verificamos que el componente hijo de selección de agentes exista
      const agentSelector = fixture.nativeElement.querySelector('app-selection-form[idElement="\'assignedAgentId\'"]');
      expect(agentSelector).toBeTruthy();
    });

    it('debería OCULTAR el selector de agentes si el rol es diferente de admin (ej: requester)', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.componentRef.setInput('currentRole', 'requester' as UserRole);
      fixture.detectChanges();

      const agentSelector = fixture.nativeElement.querySelector('app-selection-form[idElement="\'assignedAgentId\'"]');
      expect(agentSelector).toBeNull();
    });

    it('debería deshabilitar el botón de "Guardar" si el formulario es inválido', () => {
      fixture.componentRef.setInput('isOpen', true);
      // Forzamos que el título esté vacío e inválido
      fixture.detectChanges()
      component.form.patchValue({ title: '' });
      fixture.detectChanges();

      const saveButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(saveButton.disabled).toBe(true);
    });

    it('debería habilitar el botón de "Guardar" si el formulario es completamente válido', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges()
      component.form.patchValue({
        title: 'Título válido de prueba',
        description: 'Descripción detallada del incidente',
        category: 'Software',
        priority: 'LOW',
        status: 'OPEN'
      });
      fixture.detectChanges();

      const saveButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(saveButton.disabled).toBe(false);
    });

    it('debería invocar el método delete() cuando el usuario hace click en el botón de Eliminar', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.componentRef.setInput('incidentToEdit', mockIncident); // Necesario para que se muestre el botón eliminar
      fixture.detectChanges();

      const deleteSpy = vi.spyOn(component, 'delete');

      // Buscamos el botón que contiene el texto 'Eliminar'
      const buttons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
      const deleteButton = buttons.find(btn => btn.textContent?.trim() === 'Eliminar');

      expect(deleteButton).toBeTruthy();
      deleteButton?.click();

      expect(deleteSpy).toHaveBeenCalled();
    });

    it('debería emitir onClose cuando el usuario hace click en el botón Cancelar', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();

      const spyClose = vi.spyOn((component as any).onClose, 'emit');

      const buttons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
      const cancelButton = buttons.find(btn => btn.textContent?.trim() === 'Cancelar');

      cancelButton?.click();

      expect(spyClose).toHaveBeenCalled();
    });

    it('debería mostrar los metadatos ocultos (como Creado el o Reportado por) únicamente en modo edición', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.componentRef.setInput('incidentToEdit', mockIncident);
      fixture.detectChanges();

      // Buscamos la caja gris de metadata usando clases o texto específico
      const metadataBox = fixture.nativeElement.querySelector('.text-xs.text-slate-500');
      expect(metadataBox).toBeTruthy();
      expect(metadataBox.textContent).toContain('ID: inc-123');
      expect(metadataBox.textContent).toContain('Reportado por: Usuario Prueba');
    });
  });
});

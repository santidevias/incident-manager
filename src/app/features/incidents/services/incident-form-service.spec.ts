import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../../../core/services/auth.service';
import { Incident } from '../models/incident.model';
import { IncidentFormService } from './incident-form-service';

describe('IncidentFormService (Zoneless)', () => {
  let service: IncidentFormService;

  // Creamos un signal mock para controlar el usuario autenticado en las pruebas
  const mockCurrentUserSignal = signal<{ id: string } | null>({ id: 'usr-456' });

  // Mock simplificado del AuthService
  const mockAuthService = {
    currentUser: mockCurrentUserSignal
  };

  const mockIncident: Incident = {
    id: 'inc-123',
    title: 'Error de servidor 500 al guardar',
    description: 'No se puede procesar la orden debido a un fallo interno',
    category: 'Backend',
    priority: 'HIGH',
    status: 'OPEN',
    reportId: 'usr-999',
    assignedAgentId: 'agent-777',
    createdAt: '2026-10-15T10:00:00.000Z',
    updatedAt: '2026-10-15T10:00:00.000Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IncidentFormService,
        // Reemplazamos el AuthService real por nuestra versión mockeada
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(IncidentFormService);
    // Reiniciamos el valor por defecto del usuario antes de cada test
    mockCurrentUserSignal.set({ id: 'usr-456' });
  });

  describe('Creación Inicial (Modo Creación / No Incident)', () => {
    it('debe generar un formulario con valores por defecto y validar campos requeridos', () => {
      const form = service.buildForm('admin');

      expect(form.get('title')?.value).toBe('');
      expect(form.get('priority')?.value).toBe('LOW');
      expect(form.get('status')?.value).toBe('OPEN');
      expect(form.get('reportId')?.value).toBe('usr-456'); // Toma el ID del mockCurrentUserSignal
      expect(form.get('id')?.value).toBeDefined(); // Verifica que se generó un UUID

      // Validaciones del título
      const titleControl = form.get('title');
      titleControl?.setValue('Test'); // Menos de 5 caracteres
      expect(titleControl?.valid).toBeFalsy();
    });

    it('debe usar un string vacío para reportId si no hay ningún usuario logueado', () => {
      mockCurrentUserSignal.set(null); // Simulamos sesión cerrada
      const form = service.buildForm('admin');

      expect(form.get('reportId')?.value).toBe('');
    });
  });

  describe('Carga de datos (Modo Edición / Con Incident)', () => {
    it('debe poblar correctamente todos los controles del formulario con los datos del incidente', () => {
      const form = service.buildForm('admin', mockIncident);

      expect(form.get('id')?.value).toBe('inc-123');
      expect(form.get('title')?.value).toBe('Error de servidor 500 al guardar');
      expect(form.get('reportId')?.value).toBe('usr-999');
      expect(form.get('createdAt')?.value).toBe('2026-10-15T10:00:00.000Z');
    });
  });

  describe('Reglas de Seguridad y Restricciones de Roles', () => {

    describe('Campos del Sistema (Inmutables)', () => {
      it('debe deshabilitar siempre id, reportId, createdAt y updatedAt sin importar el rol', () => {
        const form = service.buildForm('admin');

        expect(form.get('id')?.disabled).toBeTruthy();
        expect(form.get('reportId')?.disabled).toBeTruthy();
        expect(form.get('createdAt')?.disabled).toBeTruthy();
        expect(form.get('updatedAt')?.disabled).toBeTruthy();
      });
    });

    describe('Rol: Requester (Solicitante)', () => {
      it('debe deshabilitar status, priority y assignedAgentId al CREAR un incidente', () => {
        const form = service.buildForm('requester');

        expect(form.get('status')?.disabled).toBeTruthy();
        expect(form.get('priority')?.disabled).toBeTruthy();
        expect(form.get('assignedAgentId')?.disabled).toBeTruthy();

        // Los datos iniciales sí deben quedar editables
        expect(form.get('title')?.enabled).toBeTruthy();
        expect(form.get('description')?.enabled).toBeTruthy();
      });

      it('debe deshabilitar el formulario COMPLETO al EDITAR un incidente ya existente', () => {
        const form = service.buildForm('requester', mockIncident);

        expect(form.disabled).toBeTruthy();
        expect(form.get('title')?.disabled).toBeTruthy();
      });
    });

    describe('Rol: Support (Agente de Soporte)', () => {
      it('debe deshabilitar los datos de origen del cliente (title, description, category, priority, assignedAgentId) al editar', () => {
        const form = service.buildForm('support', mockIncident);

        expect(form.get('title')?.disabled).toBeTruthy();
        expect(form.get('description')?.disabled).toBeTruthy();
        expect(form.get('category')?.disabled).toBeTruthy();
        expect(form.get('priority')?.disabled).toBeTruthy();
        expect(form.get('assignedAgentId')?.disabled).toBeTruthy();

        // El agente de soporte SÍ debe poder cambiar el estado y poner comentarios
        expect(form.get('status')?.enabled).toBeTruthy();
      });

      it('debe bloquear completamente el formulario si el incidente ya está en estado CLOSED', () => {
        const closedIncident = { ...mockIncident, status: 'CLOSED' as const };
        const form = service.buildForm('support', closedIncident);

        expect(form.disabled).toBeTruthy();
      });
    });

    describe('Rol: Admin (Administrador)', () => {
      it('debe mantener activos los campos operativos permitiendo edición total en modo edición', () => {
        const form = service.buildForm('admin', mockIncident);

        expect(form.get('title')?.enabled).toBeTruthy();
        expect(form.get('priority')?.enabled).toBeTruthy();
        expect(form.get('status')?.enabled).toBeTruthy();
        expect(form.get('assignedAgentId')?.enabled).toBeTruthy();
      });
    });
  });
});

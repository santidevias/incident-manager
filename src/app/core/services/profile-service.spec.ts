import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Agent } from '../models/agent.model';
import { ApiResponse } from '../models/api-response.model';
import { User } from '../models/user.model';
import { ProfileService } from './profile-service';

describe('ProfileService (Zoneless)', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl;

  // Mocks de datos compartidos para las pruebas
  const mockAgentsResponse: ApiResponse<Agent[]> = {
    success: true,
    message: '',
    data: [
      { id: 'agt-123', name: 'Agente Alfa' },
      { id: 'agt-456', name: 'Agente Beta' }
    ]
  };

  const mockUsersResponse: ApiResponse<User[]> = {
    success: true,
    message: '',
    data: [
      { id: 'usr-789', name: 'Usuario Administrador' }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProfileService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Helper común para inicializar las peticiones automáticas de los rxResource
  const initializeResources = () => {
    TestBed.tick(); // Dispara los loaders de los rxResource

    const reqAgents = httpMock.expectOne(`${baseUrl}/agents`);
    reqAgents.flush(mockAgentsResponse);

    const reqUsers = httpMock.expectOne(`${baseUrl}/users`);
    reqUsers.flush(mockUsersResponse);
  };

  describe('Inicialización de rxResource', () => {
    it('debe cargar los agentes y usuarios asignados en los signals computed', async () => {
      initializeResources();

      // Esperamos a que los signals se estabilicen con las respuestas flushed
      await TestBed.inject(ApplicationRef).whenStable();

      expect(service.assignedAgents()).toEqual(mockAgentsResponse.data);
      expect(service.users()).toEqual(mockUsersResponse.data);
    });
  });

  describe('getAgent()', () => {
    beforeEach(async () => {
      initializeResources();
      await TestBed.inject(ApplicationRef).whenStable();
    });

    it('debe retornar el ID del agente si el registro existe en la lista asignada', () => {
      // Obtenemos el computed devuelto por el método y lo evaluamos ()
      const agentIdSignal = service.getAgent('agt-123');

      expect(agentIdSignal()).toBe('agt-123');
    });

    it('debe retornar el mismo ID enviado por parámetro como fallback si el agente no existe', () => {
      const fallbackIdSignal = service.getAgent('non-existent-id');

      expect(fallbackIdSignal()).toBe('non-existent-id');
    });
  });

  describe('getUser()', () => {
    beforeEach(async () => {
      initializeResources();
      await TestBed.inject(ApplicationRef).whenStable();
    });

    it('debe retornar el ID del usuario si el registro existe en la lista', () => {
      const userIdSignal = service.getUser('usr-789');

      expect(userIdSignal()).toBe('usr-789');
    });

    it('debe retornar el mismo ID enviado por parámetro como fallback si el usuario no existe', () => {
      const fallbackIdSignal = service.getUser('unknown-user-id');

      expect(fallbackIdSignal()).toBe('unknown-user-id');
    });
  });
});

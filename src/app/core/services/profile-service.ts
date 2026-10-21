import { HttpClient } from '@angular/common/http';
import { computed, inject, Service } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';
import { Agent } from '../models/agent.model';
import { ApiResponse } from '../models/api-response.model';
import { User } from '../models/user.model';

@Service()
export class ProfileService {

  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private agentResource = rxResource({
    stream: () =>
      this.http.get<ApiResponse<Agent[]>>(`${this.apiUrl}/agents`)
  });
  assignedAgents = computed(() => this.agentResource.value()?.data ?? []);

  private userResource = rxResource({
    stream: () =>
      this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/users`)
  })
  users = computed(() => this.userResource.value()?.data ?? [])

  getAgent(id: string) {
    return computed(() => {
      return this.assignedAgents().find(record => record.id === id)?.id || id;
    });
  }

  getUser(id: string) {
    return computed(() => {
      return this.users().find(record => record.id === id)?.id || id;
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { computed, inject, Service } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Agent } from '../models/incident.model';

@Service()
export class AgentService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private agentResource = rxResource({
    stream: () =>
      this.http.get<ApiResponse<Agent[]>>(`${this.apiUrl}/incidents/agents`)
  });
  assignedAggents = computed(() => this.agentResource.value()?.data ?? []);
}

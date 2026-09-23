import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedMeta } from '../models/api-response.model';
import { Incident } from '../models/incident.model';


@Injectable({ providedIn: 'root' })
export class IncidentService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // Signals para data y paginación
  incidents = signal<Incident[]>([]);
  pagination = signal<PaginatedMeta | null>(null);
  loading = signal<boolean>(false);

  getIncidents(): void {
    this.loading.set(true);

    this.http.get<ApiResponse<Incident[]>>(`${this.apiUrl}/incidents`)
      .pipe(
        map(response => {
          // Guardamos los metadatos de paginación si vienen
          if (response.meta) {
            this.pagination.set(response.meta);
          }
          // Retornamos directamente el arreglo de incidencias
          return response.data;
        })
      )
      .subscribe({
        next: (data) => {
          this.incidents.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }
}

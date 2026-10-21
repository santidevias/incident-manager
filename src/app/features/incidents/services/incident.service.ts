import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { AuthService } from '../../../core/services/auth.service';
import { Incident } from '../models/incident.model';


@Injectable({ providedIn: 'root' })
export class IncidentService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly apiUrl = environment.apiUrl;
  private incidentResource = rxResource({
    params: () => {
      const user = this.authService.currentUser();
      return user ? { userId: user.id } : null;
    },
    stream: () =>
      this.http.get<ApiResponse<Incident[]>>(`${this.apiUrl}/incidents`)
  });
  public selectedIncident = signal<Incident | undefined>(undefined);

  incidents = computed(() => this.incidentResource.value()?.data ?? []);

  searchTerm = signal<string>('');
  statusFilter = signal<string>('all');
  priorityFilter = signal<string>('all');

  sortKey = signal<keyof Incident>('createdAt');
  sortDirection = signal<'asc' | 'desc'>('desc');

  currentPage = signal<number>(1);
  pageSize = signal<number>(5);

  processedIncidents = computed(() => {
    let result = [...this.incidents()];
    const search = this.searchTerm().toLowerCase().trim();
    const status = this.statusFilter();
    const priority = this.priorityFilter();

    // Aplicar Filtro de Búsqueda
    if (search) {
      result = result.filter(i =>
        i.title.toLowerCase().includes(search) ||
        i.id.toLowerCase().includes(search) ||
        i.category.toLowerCase().includes(search)
      );
    }

    // Aplicar Filtro de Estado
    if (status !== 'all') {
      result = result.filter(i => i.status === status);
    }
    // Aplicar Filtro de Prioridad
    if (priority !== 'all') {
      result = result.filter(i => i.priority === priority);
    }

    const key = this.sortKey();
    const direction = this.sortDirection() === 'asc' ? 1 : -1;

    result.sort((a, b) => {
      if (key === "createdAt") {
        // Ordenamiento especial para fecha.
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        if (dateA < dateB) return -1 * direction;
        if (dateA > dateB) return 1 * direction;
      } else {
        if (a[key] < b[key]) return -1 * direction;
        if (a[key] > b[key]) return 1 * direction;
      }
      return 0;
    });

    return result;
  });

  paginatedIncidents = computed(() => {
    // Computado para estructurar los incidentes según la cantidad de páginas.
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    return this.processedIncidents().slice(startIndex, startIndex + this.pageSize());
  });

  paginationDetails = computed(() => {
    // Detalle de la paginación, página actual, número de items por página, item inicio y fin de página.
    const current = this.currentPage();
    const size = this.pageSize();
    const total = this.processedIncidents().length;

    return {
      from: total === 0 ? 0 : (current - 1) * size + 1,
      to: Math.min(current * size, total),
      total: total
    };
  })

  // Cálculo del total de páginas para la UI
  totalPages = computed(() => {
    return Math.ceil(this.processedIncidents().length / this.pageSize()) || 1;
  });

  // Configuración de ordenamiento descendente o ascendente.
  changeSort(key: keyof Incident): void {
    if (this.sortKey() === key) {
      this.sortDirection.update(dir => dir === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDirection.set('asc');
    }
    this.resetPagination();
  }

  updateSearch(value: string): void {
    this.searchTerm.set(value);
    this.resetPagination();
  }

  updateStatus(value: string): void {
    this.statusFilter.set(value);
    this.resetPagination();
  }

  updatePriority(value: string): void {
    this.priorityFilter.set(value);
    this.resetPagination();
  }

  private resetPagination() {
    this.currentPage.set(1);
  }

  loading = this.incidentResource.isLoading;

  searchIndicent(id: string) {
    return this.processedIncidents().find(record => record.id === id);
  }

  setIncident(id: string) {
    const incident = this.searchIndicent(id);
    this.selectedIncident.set(incident)
  }

  updateIncidentList(form: Incident) {
    this.incidentResource.value.update(currentValue => {
      // 1. Si el recurso no tiene datos aún (o falló la carga), inicializamos la estructura
      if (!currentValue) {
        return { data: [form] } as ApiResponse<Incident[]>;
      }

      // 2. Comprobamos si el ticket ya existe en la lista actual
      const exits = currentValue.data.some(inc => inc.id === form.id);

      return {
        ...currentValue,
        data: exits
          ? currentValue.data.map(inc =>
            inc.id === form.id ? { ...inc, ...form } : inc
          ) // Si existe: Reemplaza con los nuevos datos
          : [...currentValue.data, form] // Si no existe: Lo agrega al final
      };
    });
  }

  deleteIncidentList(idIncident: string) {
    this.incidentResource.value.update(currentValue => {
      if (!currentValue) return currentValue;

      return {
        ...currentValue,
        data: currentValue.data.filter(incident => incident.id !== idIncident)
      };
    });
  }
}

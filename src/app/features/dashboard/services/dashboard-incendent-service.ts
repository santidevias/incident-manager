import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Service, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../core/services/toast-service';
import { DashboardData, DashboardMetricsAPIResponse, RecentIncidentsAPIResponse } from '../models/dashboard-inciendet-model';

@Service()
export class DashboardIncendentService {
  private toastService = inject(ToastService)

  constructor() {
    // El effect aquí solo se crea UNA vez en toda la aplicación
    effect(() => {
      if (this.metrics() && this.recentIncidents() && !this.isLoading()) {
        this.toastService.showSuccess('Méticas cargadas con éxito!');
        this.dataIsLoaded.set(true);
      }
    });
  }

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  dataIsLoaded = signal<boolean>(false);

  // 1. Definimos el recurso principal unificado
  private dashboardResource = rxResource<DashboardData, void>({
    stream: () =>
      // forkJoin ejecuta las peticiones HTTP en paralelo (igual que Promise.all)
      forkJoin([
        this.http.get<DashboardMetricsAPIResponse>(`${this.apiUrl}/dashboard/incidents-metrics`),
        this.http.get<RecentIncidentsAPIResponse>(`${this.apiUrl}/dashboard/recent-incidents`)
      ]).pipe(
        // Mapeamos los resultados combinados a nuestra interfaz limpia
        map(([metricsRes, incidentsRes]: [DashboardMetricsAPIResponse, RecentIncidentsAPIResponse]) => ({
          metrics: metricsRes.data,
          recentIncidents: incidentsRes.data
        }))
      )
  });

  // 2. Exponemos los estados individuales como Computed Signals orientadas a la UI
  readonly metrics = computed(() => this.dashboardResource.value()?.metrics ?? null);
  readonly recentIncidents = computed(() => this.dashboardResource.value()?.recentIncidents ?? []);

  // 3. Reutilizamos las señales de estado nativas que rxResource ya nos da gratis
  readonly isLoading = this.dashboardResource.isLoading;
  readonly error = computed(() =>
    this.dashboardResource.error()
      ? 'No se pudo sincronizar el panel del dashboard. Intente de nuevo.'
      : null
  );

  // 4. Si necesitas refrescar los datos manualmente (por ejemplo, un botón "Recargar")
  public reloadDashboardData(): void {
    this.dashboardResource.reload();
  }
}

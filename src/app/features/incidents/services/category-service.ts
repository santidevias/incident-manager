import { HttpClient } from '@angular/common/http';
import { computed, inject, Service } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Category } from '../models/incident.model';

@Service()
export class CategoryService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private categoriesResource = rxResource({
    stream: () =>
      this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/incidents/categories`)
  })
  categories = computed(() => this.categoriesResource.value()?.data ?? []);
}

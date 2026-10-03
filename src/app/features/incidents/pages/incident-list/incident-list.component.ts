import { Component, inject } from '@angular/core';
import { IncidentFilterPriorityComponent } from '../../components/incident-filter-priority/incident-filter-priority.component';
import { IncidentFilterStatusComponent } from '../../components/incident-filter-status/incident-filter-status.component';
import { IncidentPaginationComponent } from '../../components/incident-pagination/incident-pagination.component';
import { IncidentSearchComponent } from '../../components/incident-search/incident-search.component';
import { IncidentTableComponent } from '../../components/incident-table/incident-table.component';
import { Incident } from '../../models/incident.model';
import { IncidentService } from '../../services/incident.service';

@Component({
  selector: 'app-incident-list',
  imports: [IncidentSearchComponent, IncidentFilterStatusComponent, IncidentTableComponent, IncidentPaginationComponent, IncidentFilterPriorityComponent],
  templateUrl: './incident-list.component.html',
  styleUrl: './incident-list.component.css',
})
export class IncidentListComponent {
  private incident_service = inject(IncidentService);
  incidents = this.incident_service.incidents;
  incidentsLoading = this.incident_service.loading;

  searchTerm = this.incident_service.searchTerm;
  statusFilter = this.incident_service.statusFilter;
  priorityFilter = this.incident_service.priorityFilter;

  sortKey = this.incident_service.sortKey;
  sortDirection = this.incident_service.sortDirection;

  currentPage = this.incident_service.currentPage;
  pageSize = this.incident_service.pageSize;

  processedIncidents = this.incident_service.processedIncidents;
  paginatedIncidents = this.incident_service.paginatedIncidents;
  totalPages = this.incident_service.totalPages;
  paginationDetails = this.incident_service.paginationDetails;


  protected changeSort(key: string) {
    this.incident_service.changeSort(key as keyof Incident);
  }

  protected updateSearch(val: string) {
    this.incident_service.updateSearch(val);
  }

  protected updateStatus(val: string) {
    this.incident_service.updateStatus(val);
  }

  protected updatePriority(val: string) {
    this.incident_service.updatePriority(val);
  }

  setPage(val: number) {
    this.currentPage.set(val);
  }

  viewDetails(id: string) {
    console.log('Ver detalles del incidente:', id);
  }
}

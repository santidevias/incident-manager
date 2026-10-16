import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { IncidentFilterPriorityComponent } from '../../components/incident-filter-priority/incident-filter-priority.component';
import { IncidentFilterStatusComponent } from '../../components/incident-filter-status/incident-filter-status.component';
import { IncidentModalFormComponent } from '../../components/incident-modal-form/incident-modal-form.component';
import { IncidentPaginationComponent } from '../../components/incident-pagination/incident-pagination.component';
import { IncidentSearchComponent } from '../../components/incident-search/incident-search.component';
import { IncidentTableComponent } from '../../components/incident-table/incident-table.component';
import { Incident } from '../../models/incident.model';
import { IncidentService } from '../../services/incident.service';
import { ModalService } from '../../services/modal-service';

@Component({
  selector: 'app-incident-list',
  imports: [IncidentSearchComponent, IncidentFilterStatusComponent, IncidentTableComponent, IncidentPaginationComponent, IncidentFilterPriorityComponent, IncidentModalFormComponent],
  templateUrl: './incident-list.component.html',
  styleUrl: './incident-list.component.css',
})
export class IncidentListComponent {
  private incident_service = inject(IncidentService);
  protected auth_service = inject(AuthService);
  protected modal_service = inject(ModalService);
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

  isOpen = this.modal_service.isOpen;
  incidentSelected = this.incident_service.selectedIncident;

  role = this.auth_service.role;


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
    this.incident_service.setIncident(id);
    this.modal_service.open();
  }

  openModal() {
    this.modal_service.open();
  }

  onSave(value: Incident) {
    this.incident_service.updateIncidentList(value);
    this.modalClose();
  }

  onDelete(incident: Incident) {
    this.incident_service.deleteIncidentList(incident.id);
    this.modalClose();
  }

  modalClose() {
    this.incident_service.setIncident('');
    this.modal_service.close();
  }

}

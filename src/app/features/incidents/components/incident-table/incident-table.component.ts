import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { IncidentPriorityPipe } from '../../../../shared/pipes/incident-priority-pipe';
import { IncidentStatePipe } from '../../../../shared/pipes/incident-state-pipe';
import { Incident } from '../../models/incident.model';

@Component({
  selector: 'app-incident-table',
  imports: [DatePipe, IncidentStatePipe, IncidentPriorityPipe, LoadingSpinnerComponent, LoadingSpinnerComponent],
  templateUrl: './incident-table.component.html',
  styleUrl: './incident-table.component.css',
})
export class IncidentTableComponent {
  paginatedIncidents = input.required<Incident[]>();
  incidentsLoading = input<boolean>(false);
  sortKey = input<string>('');
  sortDirection = input<'asc' | 'desc'>('asc');

  onSort = output<string>();
  onViewDetails = output<string>();

  // Métodos internos que notifican al padre
  changeSort(key: keyof Incident) {
    this.onSort.emit(key);
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 ring-red-600/10';
      case 'HIGH': return 'bg-orange-100 text-orange-800 ring-orange-600/10';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 ring-yellow-600/10';
      default: return 'bg-green-100 text-green-800 ring-green-600/10';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'OPEN': return 'bg-blue-50 text-blue-700 ring-blue-700/10';
      case 'IN_PROGRESS': return 'bg-purple-50 text-purple-700 ring-purple-700/10';
      default: return 'bg-gray-50 text-gray-600 ring-gray-500/10';
    }
  }

  viewDetails(id: string) {
    this.onViewDetails.emit(id);
  }

}

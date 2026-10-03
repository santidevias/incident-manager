import { Component, input, output } from '@angular/core';
import { Incident } from '../../models/incident.model';

@Component({
  selector: 'app-incident-pagination',
  imports: [],
  templateUrl: './incident-pagination.component.html',
  styleUrl: './incident-pagination.component.css',
})
export class IncidentPaginationComponent {
  incidentsLoading = input.required<boolean>();
  processedIncidents = input.required<Incident[]>();
  currentPage = input.required<number>();
  onSetPage = output<number>();
  paginationDetails = input.required<{
    from: number;
    to: number;
    total: number;
  }>();
  totalPages = input<number>();

  setPage(val: number) {
    this.onSetPage.emit(val);
  }

}

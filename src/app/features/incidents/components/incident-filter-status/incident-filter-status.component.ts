import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-incident-filter-status',
  imports: [],
  templateUrl: './incident-filter-status.component.html',
  styleUrl: './incident-filter-status.component.css',
})
export class IncidentFilterStatusComponent {
  statusFilter = input<string>();
  onUpdateStatus = output<string>();

  updateStatus(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.onUpdateStatus.emit(val);
  }
}

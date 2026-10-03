import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-incident-filter-priority',
  imports: [],
  templateUrl: './incident-filter-priority.component.html',
  styleUrl: './incident-filter-priority.component.css',
})
export class IncidentFilterPriorityComponent {
  priorityFilter = input<string>();
  onUpdatePriority = output<string>();

  updatePriority(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.onUpdatePriority.emit(val);
  }
}

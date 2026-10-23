import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IncidentPriorityPipe } from '../../../../shared/pipes/incident-priority-pipe';
import { DashboardIncendentService } from '../../services/dashboard-incendent-service';

@Component({
  selector: 'app-stats-incident',
  imports: [CommonModule, IncidentPriorityPipe],
  templateUrl: './stats-incident.component.html',
  styleUrl: './stats-incident.component.css',
})
export class StatsIncidentComponent {
  readonly dashboardService = inject(DashboardIncendentService);

  getPriorityClass(priority: string): string {
    const classes = {
      CRITICAL: 'bg-red-100 text-red-800 border-red-200',
      HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      LOW: 'bg-green-100 text-green-800 border-green-200'
    };
    return classes[priority as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

}

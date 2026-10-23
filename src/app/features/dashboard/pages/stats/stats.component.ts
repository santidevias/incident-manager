import { Component } from '@angular/core';
import { StatsIncidentComponent } from '../../components/stats-incident/stats-incident.component';

@Component({
  selector: 'app-stats',
  imports: [StatsIncidentComponent, StatsIncidentComponent],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css',
})
export class StatsComponent { }

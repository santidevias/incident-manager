import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'incidentState',
})
export class IncidentStatePipe implements PipeTransform {
  private readonly STATES: Record<string, string> = {
    'OPEN': 'Abierto',
    'IN_PROGRESS': 'En proceso',
    'CLOSED': 'Resuelto',
  };

  transform(code: string): string {
    return this.STATES[code] || code;
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'incidentPriority',
})
export class IncidentPriorityPipe implements PipeTransform {
  private readonly PRIORITY: Record<string, string> = {
    "CRITICAL": "Critica",
    "HIGH": "Alta",
    "MEDIUM": "Media",
    "LOW": "Baja",
  }
  transform(code: string): string {
    return this.PRIORITY[code] || code;
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'position',
})
export class PositionPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    if (!value) return value;
    switch (value) {
      case "development":
        return "Desarrollador";
      case "disign":
        return "Diseñador";
      case "architect":
        return "Arquitecto";
      default:
        return "No encontrado";
    }
  }
}

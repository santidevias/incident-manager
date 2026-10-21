import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleUser',
})
export class RoleUserPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case "admin":
        return "Administrador";
      case "support":
        return "Agende de soporte";
      default:
        return "Solicitante";
    }
  }
}

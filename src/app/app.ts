import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Employees } from './shared/components/employees/employees';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Employees],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  direccion = {
    county: "",
    state: "",
    city: "",
  }
  protected readonly title = signal('project-angular');
  city = 'Pereira';

  saveForm() {
    console.log("formulario: ", this.direccion);
  }
}

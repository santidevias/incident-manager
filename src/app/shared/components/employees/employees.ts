import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PositionPipe } from '../../pipes/position-pipe';

@Component({
  selector: 'app-employees',
  imports: [FormsModule, CurrencyPipe, DatePipe, UpperCasePipe, PositionPipe],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees {
  name = '';
  email = '';
  position = '';
  salary = 0;
  date_start = '';
  active = false;

  onSave() {
    console.log("form: ", {
      name: this.name,
      email: this.email,
      position: this.position,
      salary: this.salary,
      date_start: this.date_start,
      active: this.active,
    });
  }
}

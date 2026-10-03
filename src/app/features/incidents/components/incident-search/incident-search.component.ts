import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-incident-search',
  imports: [],
  templateUrl: './incident-search.component.html',
  styleUrl: './incident-search.component.css',
})
export class IncidentSearchComponent {
  searchTerm = input<string>();
  onUpdateSearch = output<string>();

  updateSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.onUpdateSearch.emit(val);
  }
}

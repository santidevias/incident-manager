import { Component, computed, input, output } from '@angular/core';
import { Selectable } from '../../../core/models/selectable.model';

@Component({
  selector: 'app-selection-form',
  imports: [],
  templateUrl: './selection-form.component.html',
  styleUrl: './selection-form.component.css',
})
export class SelectionFormComponent<T extends Selectable> {
  labelName = input<string>('Selecciona un elemento');
  idElement = input<string>('item-select');
  defaultValue = input<string>('');
  items = input.required<T[]>();
  selectionChange = output<T>();
  selectedInit = computed(() => {
    const defaultVal = this.defaultValue();
    return this.items().find(record => String(record.id) === defaultVal);
  });

  onSelect(event: Event): void {
    const selectEl = event.target as HTMLSelectElement;
    const selectedItem = this.items().find(i => String(i.id) === selectEl.value);
    if (selectedItem) {
      this.selectionChange.emit(selectedItem);
    }
  }
}


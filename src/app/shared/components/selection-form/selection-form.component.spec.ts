import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Selectable } from '../../../core/models/selectable.model';
import { SelectionFormComponent } from './selection-form.component';

interface MockItem extends Selectable {
  id: string;
  name: string;
}

describe('SelectionFormComponent', () => {
  let component: SelectionFormComponent<MockItem>;
  let fixture: ComponentFixture<SelectionFormComponent<MockItem>>;
  let mockItems: MockItem[];
  let mockControl: FormControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectionFormComponent<MockItem>);
    component = fixture.componentInstance;

    mockItems = [
      { id: '1', name: 'Opción A' },
      { id: '2', name: 'Opción B' },
      { id: '3', name: 'Opción C' },
    ];
    mockControl = new FormControl('');

    // Configuración de los inputs requeridos iniciales utilizando setInput (Obligatorio para Signal Inputs)
    fixture.componentRef.setInput('control', mockControl);
    fixture.componentRef.setInput('items', mockItems);

    fixture.detectChanges();

  });

  it('debería crear el componente con valores por defecto', () => {
    expect(component).toBeTruthy();
    expect(component.labelName()).toBe('Selecciona un elemento');
    expect(component.idElement()).toBe('item-select');
    expect(component.defaultValue()).toBe('');
  });

  it('debería calcular correctamente selectedInit cuando coincide con defaultValue', () => {
    fixture.componentRef.setInput('defaultValue', '2');
    fixture.detectChanges();

    expect(component.selectedInit()).toEqual({ id: '2', name: 'Opción B' });
  });

  it('debería retornar undefined en selectedInit si defaultValue no coincide con ningún item', () => {
    fixture.componentRef.setInput('defaultValue', '99');
    fixture.detectChanges();

    expect(component.selectedInit()).toBeUndefined();
  });

  it('debería retornar el formulario correcto mediante el computed controlForm', () => {
    expect(component.controlForm()).toBe(mockControl);
  });

  it('debería emitir el objeto seleccionado en el evento selectionChange cuando onSelect es invocado', () => {
    const spyOutput = vi.spyOn(component.selectionChange, 'emit');

    const mockEvent = {
      target: {
        value: '3',
      },
    } as unknown as Event;

    component.onSelect(mockEvent);

    expect(spyOutput).toHaveBeenCalledWith({ id: '3', name: 'Opción C' });

  });

  it('no debería emitir nada en selectionChange si el valor seleccionado no se encuentra en la lista de items', () => {
    const spyOutput = vi.spyOn(component.selectionChange, 'emit');

    const mockEvent = {
      target: {
        value: '999',
      },
    } as unknown as Event;

    component.onSelect(mockEvent);

    expect(spyOutput).not.toHaveBeenCalled();

  });
});

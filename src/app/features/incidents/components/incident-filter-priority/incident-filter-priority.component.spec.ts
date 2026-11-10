import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest'; // 👈 Importaciones explícitas de Vitest
import { IncidentFilterPriorityComponent } from './incident-filter-priority.component';
const jest = vi;

describe('IncidentFilterPriorityComponent', () => {
  let component: IncidentFilterPriorityComponent;
  let fixture: ComponentFixture<IncidentFilterPriorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentFilterPriorityComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentFilterPriorityComponent);
    component = fixture.componentInstance;

    TestBed.tick();
  });

  it('debe crear el componente con éxito', () => {
    expect(component).toBeTruthy();
  });

  it('debe emitir el nuevo valor de prioridad cuando cambie la selección', () => {
    const emitSpy = jest.spyOn(component.onUpdatePriority, 'emit');

    const mockValue = 'HIGH';
    const mockEvent = {
      target: {
        value: mockValue
      }
    } as unknown as Event;
    component.updatePriority(mockEvent);

    expect(emitSpy).toHaveBeenCalledWith(mockValue);
  });
});

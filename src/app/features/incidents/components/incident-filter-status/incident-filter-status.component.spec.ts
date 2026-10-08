import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IncidentFilterStatusComponent } from './incident-filter-status.component';

describe('IncidentFilterStatusComponent (Estándar Senior)', () => {
  let component: IncidentFilterStatusComponent;
  let fixture: ComponentFixture<IncidentFilterStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentFilterStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentFilterStatusComponent);
    component = fixture.componentInstance;
    TestBed.tick();
  });

  it('debe instanciar el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('Lógica Interna (TypeScript)', () => {
    it('debe emitir el estado correcto al ejecutar updateStatus() de forma manual', () => {
      const updateStatusSpy = vi.spyOn(component.onUpdateStatus, 'emit');
      const mockValue = 'IN_PROGRESS';
      const mockEvent = {
        target: { value: mockValue }
      } as unknown as Event;

      component.updateStatus(mockEvent);

      expect(updateStatusSpy).toHaveBeenCalledWith(mockValue);
    });
  });

  describe('Interacción con la UI (DOM)', () => {
    it('debe capturar la selección del usuario en el HTML y emitir el output esperado', () => {
      const updateStatusSpy = vi.spyOn(component.onUpdateStatus, 'emit');

      fixture.detectChanges();
      const selectEl = fixture.nativeElement.querySelector('[data-testid="status-filter-select"]') as HTMLSelectElement;

      expect(selectEl).not.toBeNull();

      const targetStatus = 'CLOSED';
      selectEl.value = targetStatus;
      selectEl.dispatchEvent(new Event('change'));

      expect(updateStatusSpy).toHaveBeenCalledWith(targetStatus);
    });

    it('debe sincronizar el valor del input signal con el valor reflejado en el select del DOM', () => {
      const defaultStatus = 'OPEN';
      fixture.componentRef.setInput('statusFilter', defaultStatus);

      TestBed.tick();
      fixture.detectChanges();
      const selectEl = fixture.nativeElement.querySelector('[data-testid="status-filter-select"]') as HTMLSelectElement;

      expect(selectEl.value).toBe(defaultStatus);
    });
  });
});

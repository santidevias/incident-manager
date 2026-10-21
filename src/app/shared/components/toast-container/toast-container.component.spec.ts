import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Toast } from '../../../core/models/toast.model'; // Asegúrate de ajustar la ruta
import { ToastService } from '../../../core/services/toast-service';
import { ToastContainerComponent } from './toast-container.component';

describe('ToastContainerComponent', () => {
  let component: ToastContainerComponent;
  let fixture: ComponentFixture<ToastContainerComponent>;
  let mockToastService: { toasts: any; remove: any };

  beforeEach(async () => {
    // 1. Crear un mock usando señales reales para que el @for reaccione automáticamente
    mockToastService = {
      toasts: signal<Toast[]>([]),
      remove: vi.fn(), // Espía (spy) de Vitest para verificar llamadas
    };

    await TestBed.configureTestingModule({
      imports: [ToastContainerComponent], // Al ser un componente Standalone se importa aquí
      providers: [
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Ejecuta la detección de cambios inicial
  });

  it('debería crearse correctamente el componente', () => {
    expect(component).toBeTruthy();
  });

  it('no debería renderizar ningún toast si la lista está vacía', () => {
    const toastElements = fixture.debugElement.queryAll(By.css('.flex.items-center'));
    expect(toastElements.length).toBe(0);
  });

  it('debería renderizar la lista de toasts cuando la señal cambia', () => {
    // 1. Modificar el estado de la señal simulada
    mockToastService.toasts.set([
      { id: 1, message: 'Toast de Éxito', type: 'success', duration: 3000 },
      { id: 2, message: 'Toast de Error', type: 'error', duration: 3000 }
    ]);

    // 2. Notificar a Angular para actualizar el DOM con el @for
    fixture.detectChanges();

    // 3. Verificar que los elementos HTML existan y muestren el texto correcto
    const toastElements = fixture.debugElement.queryAll(By.css('.animate-fade-in'));
    expect(toastElements.length).toBe(2);

    expect(toastElements[0].nativeElement.textContent).toContain('Toast de Éxito');
    expect(toastElements[1].nativeElement.textContent).toContain('Toast de Error');
  });

  it('debería aplicar las clases CSS correspondientes según el tipo de toast', () => {
    mockToastService.toasts.set([
      { id: 1, message: 'Alerta', type: 'warning', duration: 3000 }
    ]);
    fixture.detectChanges();

    const toastDiv = fixture.debugElement.query(By.css('.animate-fade-in')).nativeElement;

    // Validar el método de ayuda del componente
    const expectedClasses = component.getToastClasses('warning');
    expect(expectedClasses).toBe('bg-yellow-50 border-yellow-200 text-yellow-800');

    // Validar que realmente se hayan inyectado en el HTML mediante [ngClass]
    expect(toastDiv.className).toContain('bg-yellow-50');
    expect(toastDiv.className).toContain('border-yellow-200');
  });

  it('debería llamar al método remove() del servicio al hacer clic en el botón ✕', () => {
    mockToastService.toasts.set([
      { id: 99, message: 'Elimíname', type: 'info', duration: 3000 }
    ]);
    fixture.detectChanges();

    // Buscar el botón dentro del toast renderizado
    const closeButton = fixture.debugElement.query(By.css('button'));

    // Simular el evento click
    closeButton.triggerEventHandler('click', null);

    // Verificar que el método espía del servicio fue llamado con el ID correcto
    expect(mockToastService.remove).toHaveBeenCalledWith(99);
    expect(mockToastService.remove).toHaveBeenCalledTimes(1);
  });
});

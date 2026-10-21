import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastService } from './toast-service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService]
    });
    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    // Restaurar los temporizadores reales después de cada prueba
    vi.useRealTimers();
  });

  it('debería inicializarse con una lista de toasts vacía', () => {
    // Las señales se leen ejecutándolas como una función: ()
    expect(service.toasts()).toEqual([]);
  });

  it('debería añadir un nuevo toast a la lista con valores por defecto', () => {
    service.show('Mensaje de prueba');

    const currentToasts = service.toasts();
    expect(currentToasts.length).toBe(1);
    expect(currentToasts[0].message).toBe('Mensaje de prueba');
    expect(currentToasts[0].type).toBe('info');
    expect(currentToasts[0].duration).toBe(3000);
    expect(currentToasts[0].id).toBeLessThanOrEqual(Date.now());
  });

  it('debería crear un toast de tipo success usando showSuccess()', () => {
    service.showSuccess('Operación exitosa', 1500);

    const currentToasts = service.toasts();
    expect(currentToasts.length).toBe(1);
    expect(currentToasts[0].type).toBe('success');
    expect(currentToasts[0].duration).toBe(1500);
  });

  it('debería eliminar un toast manualmente por su ID', () => {
    service.show('Toast a eliminar');
    const id = service.toasts()[0].id;

    service.remove(id);

    expect(service.toasts().length).toBe(0);
  });

  it('debería auto-eliminar el toast una vez transcurrida su duración', () => {
    // 1. Activar los temporizadores falsos de Vitest
    vi.useFakeTimers();

    // 2. Crear un toast con duración de 2000ms
    service.show('Toast temporal', 'warning', 2000);
    expect(service.toasts().length).toBe(1);

    // 3. Avanzar el tiempo simulado justo antes de que expire (1999ms)
    vi.advanceTimersByTime(1999);
    expect(service.toasts().length).toBe(1); // Sigue ahí

    // 4. Avanzar el tiempo restante para cumplir los 2000ms
    vi.advanceTimersByTime(1);
    expect(service.toasts().length).toBe(0); // Se ha eliminado automáticamente
  });
});

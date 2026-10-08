import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IncidentSearchComponent } from './incident-search.component';

describe('IncidentSearchComponent', () => {
  let component: IncidentSearchComponent;
  let fixture: ComponentFixture<IncidentSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentSearchComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentSearchComponent);
    component = fixture.componentInstance;

    TestBed.tick();
  });

  it('debe crear el componente con éxito', () => {
    expect(component).toBeTruthy();
  });

  // ==========================================
  // ENFOQUE 1: PRUEBA DE LÓGICA PURA
  // ==========================================
  describe('Lógica de la Clase (TypeScript)', () => {
    it('debe emitir el valor del texto cuando se ejecuta updateSearch()', () => {
      // 1. Creamos el espía para el output de Vitest
      const searchSpy = vi.spyOn(component.onUpdateSearch, 'emit');

      // 2. Simulamos la estructura exacta que espera (event.target.value)
      const mockText = 'Fallo de red';
      const mockEvent = {
        target: {
          value: mockText
        }
      } as unknown as Event;

      // 3. Ejecutamos el método directamente
      component.updateSearch(mockEvent);

      // 4. Verificamos que el output emita el string simulado
      expect(searchSpy).toHaveBeenCalledWith(mockText);
    });
  });

  // ==========================================
  // ENFOQUE 2: PRUEBA DE INTEGRACIÓN (DOM)
  // ==========================================
  describe('Integración con el DOM (HTML)', () => {
    it('debe emitir el término de búsqueda cuando el usuario escribe en el input', () => {
      const searchSpy = vi.spyOn(component.onUpdateSearch, 'emit');

      // Sincronizamos el renderizado inicial del HTML
      fixture.detectChanges();

      // 1. Buscamos el input usando un selector preciso de pruebas (Escenario C)
      // Nota: Asume que en tu HTML tienes algo como: <input data-testid="search-input" ...>
      const inputEl = fixture.nativeElement.querySelector('[data-testid="search-input"]') ||
        fixture.nativeElement.querySelector('input'); // Fallback al input genérico si no lo tienes

      expect(inputEl).toBeTruthy();

      // 2. Simulamos que el usuario escribe un valor directamente en la pantalla
      const textTyped = 'Base de datos';
      inputEl.value = textTyped;

      // 3. Disparamos el evento 'input' nativo para que Angular ejecute el (input)="updateSearch($event)"
      inputEl.dispatchEvent(new Event('input'));

      // 4. Verificamos que el puente HTML -> TS se haya completado con éxito
      expect(searchSpy).toHaveBeenCalledWith(textTyped);
    });
  });
});

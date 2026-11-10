import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Incident } from '../../models/incident.model';
import { IncidentPaginationComponent } from './incident-pagination.component';

const jest = vi;

describe('IncidentPaginationComponent (Cobertura Total 100%)', () => {
  let component: IncidentPaginationComponent;
  let fixture: ComponentFixture<IncidentPaginationComponent>;

  const mockIncidentSeed = [{ id: '1' } as Incident];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentPaginationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentPaginationComponent);
    component = fixture.componentInstance;

    // Inicialización por defecto para renderizar el bloque HTML principal
    fixture.componentRef.setInput('incidentsLoading', false);
    fixture.componentRef.setInput('processedIncidents', mockIncidentSeed);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('paginationDetails', { from: 1, to: 1, total: 1 });
    fixture.componentRef.setInput('totalPages', 1);

    fixture.detectChanges();
  });

  it('debe crear la instancia del componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe emitir el número de página correcto al ejecutar setPage()', () => {
    const setPageSpy = jest.spyOn(component.onSetPage, 'emit');
    component.setPage(3);
    expect(setPageSpy).toHaveBeenCalledWith(3);
  });

  it('debe reflejar correctamente los valores pasados a sus inputs', () => {
    const mockDetails = { from: 1, to: 5, total: 25 };
    fixture.componentRef.setInput('paginationDetails', mockDetails);
    fixture.componentRef.setInput('currentPage', 2);
    fixture.componentRef.setInput('totalPages', 5);

    expect(component.paginationDetails()).toEqual(mockDetails);
    expect(component.currentPage()).toBe(2);
    expect(component.totalPages()).toBe(5);
  });

  describe('Renderizado Condicional y Ramas HTML', () => {
    it('no debe renderizar nada si la tabla está cargando o no hay incidentes procesados', async () => {
      fixture.componentRef.setInput('incidentsLoading', true);
      fixture.componentRef.setInput('processedIncidents', []);

      await Promise.resolve();
      fixture.detectChanges();

      const mainContainer = fixture.nativeElement.querySelector('.flex');
      expect(mainContainer).toBeNull();
    });

    it('debe aplicar clases CSS activas o inactivas según la página seleccionada en el @for', async () => {
      fixture.componentRef.setInput('currentPage', 2);
      fixture.componentRef.setInput('totalPages', 3);

      await Promise.resolve();
      fixture.detectChanges();

      const navButtons = fixture.nativeElement.querySelectorAll('nav button');
      const page1Btn = navButtons[1] as HTMLButtonElement;
      const page2Btn = navButtons[2] as HTMLButtonElement;

      expect(page1Btn.className).toContain('text-gray-900');
      expect(page2Btn.className).toContain('bg-indigo-600');
    });

    // =========================================================
    // CASOS LÍMITES DE DESHABILITACIÓN (MÓVIL Y ESCRITORIO)
    // =========================================================
    it('debe deshabilitar los botones de retroceso en la primera página', async () => {
      fixture.componentRef.setInput('currentPage', 1);
      fixture.componentRef.setInput('totalPages', 3);

      await Promise.resolve();
      fixture.detectChanges();

      const allButtons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];

      // Filtramos las flechas del entorno de escritorio por su contenido
      const mobilePrevBtn = allButtons.find(b => b.textContent?.trim() === 'Anterior');
      const desktopPrevBtn = allButtons.find(b => b.textContent?.trim() === '«');

      expect(mobilePrevBtn?.disabled).toBe(true);
      expect(desktopPrevBtn?.disabled).toBe(true);
    });

    it('debe deshabilitar los botones de avance al encontrarse en la última página', async () => {
      fixture.componentRef.setInput('currentPage', 3);
      fixture.componentRef.setInput('totalPages', 3);

      await Promise.resolve();
      fixture.detectChanges();

      const allButtons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];

      const mobileNextBtn = allButtons.find(b => b.textContent?.trim() === 'Siguiente');
      const desktopNextBtn = allButtons.find(b => b.textContent?.trim() === '»');

      expect(mobileNextBtn?.disabled).toBe(true);
      expect(desktopNextBtn?.disabled).toBe(true);
    });

    // =========================================================
    // COBERTURA CRÍTICA DE CLICS (LÍNEAS 35 Y 56 DEL HTML)
    // =========================================================
    it('debe disparar setPage desde las flechas de escritorio (Líneas 35 y 56)', async () => {
      const setPageSpy = jest.spyOn(component.onSetPage, 'emit');

      // Nos paramos en la página 2 de 3 para que ninguna flecha esté deshabilitada
      fixture.componentRef.setInput('currentPage', 2);
      fixture.componentRef.setInput('totalPages', 3);

      await Promise.resolve();
      fixture.detectChanges();

      const allButtons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];

      // Buscamos exactamente los elementos contenedores de las líneas 35 y 56
      const desktopPrevBtn = allButtons.find(b => b.textContent?.trim() === '«');
      const desktopNextBtn = allButtons.find(b => b.textContent?.trim() === '»');

      // Click en la Flecha Izquierda (Escritorio) -> Línea 35
      desktopPrevBtn?.dispatchEvent(new Event('click'));
      expect(setPageSpy).toHaveBeenCalledWith(1);

      // Click en la Flecha Derecha (Escritorio) -> Línea 56
      desktopNextBtn?.dispatchEvent(new Event('click'));
      expect(setPageSpy).toHaveBeenCalledWith(3);
    });

    it('debe disparar setPage desde los botones de la vista móvil', async () => {
      const setPageSpy = jest.spyOn(component.onSetPage, 'emit');
      fixture.componentRef.setInput('currentPage', 2);
      fixture.componentRef.setInput('totalPages', 3);

      await Promise.resolve();
      fixture.detectChanges();

      const allButtons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];

      const mobilePrevBtn = allButtons.find(b => b.textContent?.trim() === 'Anterior');
      const mobileNextBtn = allButtons.find(b => b.textContent?.trim() === 'Siguiente');

      mobilePrevBtn?.dispatchEvent(new Event('click'));
      expect(setPageSpy).toHaveBeenCalledWith(1);

      mobileNextBtn?.dispatchEvent(new Event('click'));
      expect(setPageSpy).toHaveBeenCalledWith(3);
    });

    it('debe disparar la emisión al presionar botones numéricos en el escritorio', async () => {
      const setPageSpy = jest.spyOn(component.onSetPage, 'emit');
      fixture.componentRef.setInput('currentPage', 1);
      fixture.componentRef.setInput('totalPages', 3);

      await Promise.resolve();
      fixture.detectChanges();

      const allButtons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];

      // Buscamos el botón que explícitamente tiene impreso el número "3"
      const page3Btn = allButtons.find(b => b.textContent?.trim() === '3');
      page3Btn?.dispatchEvent(new Event('click'));

      expect(setPageSpy).toHaveBeenCalledWith(3);
    });
  });
});

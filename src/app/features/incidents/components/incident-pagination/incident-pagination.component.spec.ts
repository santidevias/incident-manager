import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Incident } from '../../models/incident.model';
import { IncidentPaginationComponent } from './incident-pagination.component';

describe('IncidentPaginationComponent (Lógica de la Clase)', () => {
  let component: IncidentPaginationComponent;
  let fixture: ComponentFixture<IncidentPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentPaginationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentPaginationComponent);
    component = fixture.componentInstance;

    // Inicializamos los inputs requeridos con datos semilla para que el componente arranque limpio
    fixture.componentRef.setInput('incidentsLoading', false);
    fixture.componentRef.setInput('processedIncidents', [] as Incident[]);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('paginationDetails', { from: 0, to: 0, total: 0 });

    TestBed.tick();
  });

  it('debe crear la instancia del componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe emitir el número de página correcto al ejecutar setPage()', () => {
    // 1. Creamos el espía de Vitest para el output moderno
    const setPageSpy = vi.spyOn(component.onSetPage, 'emit');

    // 2. Ejecutamos directamente el método de la clase
    const pageToSet = 3;
    component.setPage(pageToSet);

    // 3. Validamos que el output haya reaccionado con el argumento correcto
    expect(setPageSpy).toHaveBeenCalledWith(pageToSet);
  });

  it('debe reflejar correctamente los valores pasados a sus inputs', () => {
    // Esta prueba valida que los canales de comunicación de los inputs funcionen
    const mockDetails = { from: 1, to: 5, total: 25 };

    // Asignamos nuevos valores usando la API nativa de Angular para señales de entrada
    fixture.componentRef.setInput('paginationDetails', mockDetails);
    fixture.componentRef.setInput('currentPage', 2);
    fixture.componentRef.setInput('totalPages', 5);

    // Evaluamos el valor de las señales leyéndolas como funciones ()
    expect(component.paginationDetails()).toEqual(mockDetails);
    expect(component.currentPage()).toBe(2);
    expect(component.totalPages()).toBe(5);
  });
});

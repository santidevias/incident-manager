import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializarse con los valores por defecto', () => {
    expect(component.size()).toBe('md');
    expect(component.color()).toBe('#3b82f6');
    expect(component.loadingText()).toBe('');
  });

  it('debe permitir cambiar el tamaño (size input)', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    expect(component.size()).toBe('lg');
  });

  it('debe permitir cambiar el color personalizado', () => {
    fixture.componentRef.setInput('color', '#ff0000');
    fixture.detectChanges();

    expect(component.color()).toBe('#ff0000');
  });

  it('debe permitir asignar un texto de carga', () => {
    const textoPrueba = 'Cargando datos...';
    fixture.componentRef.setInput('loadingText', textoPrueba);
    fixture.detectChanges();

    expect(component.loadingText()).toBe(textoPrueba);
  });

  it('debe resolver las clases de tamaño correctamente según el diccionario clases', () => {
    const clasesDisponibles = (component as any).sizeClasses();

    expect(clasesDisponibles['sm']).toBe('w-5 h-5 border-2');
    expect(clasesDisponibles['md']).toBe('w-8 h-8 border-4');
    expect(clasesDisponibles['lg']).toBe('w-12 h-12 border-4');
    expect(clasesDisponibles['xl']).toBe('w-16 h-16 border-4');
  });
});

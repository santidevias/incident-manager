import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MainLayoutComponent } from './main-layout.component';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;

  const mockAuthService = {
    logout: vi.fn(),
    role: signal('admin'),
    roleInitial: signal('a'),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializarse con el menú móvil cerrado (false)', () => {
    expect(component.isMobileMenuOpen()).toBe(false);
  });

  it('debe alternar el estado del menú móvil al llamar a toggleMobileMenu()', () => {
    // Primer click/llamada: cambia de false a true
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen()).toBe(true);

    // Segunda llamada: cambia de true a false
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen()).toBe(false);
  });

  it('debe forzar el cierre del menú móvil al llamar a closeMobileMenu()', () => {
    // Lo abrimos manualmente primero cambiando el estado del signal
    component.isMobileMenuOpen.set(true);

    // Ejecutamos la función de cierre
    component.closeMobileMenu();

    expect(component.isMobileMenuOpen()).toBe(false);
  });

  it('debe llamar al método logout del AuthService al ejecutar logout()', () => {
    component.logout();

    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});

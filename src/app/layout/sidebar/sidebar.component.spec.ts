import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  const mockAuthService = {
    logout: vi.fn(),
    role: signal('admin'),
    roleInitial: signal('a'),
  };

  beforeEach(async () => {


    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializarse con isMobileMenuOpen en false por defecto', () => {
    expect(component.isMobileMenuOpen()).toBe(false);
  });

  it('debe emitir el evento toggleMenu cuando se llama a toggleMobileMenu()', () => {
    const emitSpy = vi.spyOn(component.toggleMenu, 'emit');

    component.toggleMobileMenu();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('debe emitir el evento closeMenu cuando se llama a closeMobileMenu()', () => {
    const emitSpy = vi.spyOn(component.closeMenu, 'emit');

    component.closeMobileMenu();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('debe llamar al método logout del AuthService al ejecutar logout()', () => {
    component.logout();

    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});

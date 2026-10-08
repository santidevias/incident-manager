import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent (Estándar Senior - Formularios y Rutas)', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthService = {
      login: vi.fn()
    };

    mockRouter = {
      navigate: vi.fn().mockResolvedValue(true)
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    TestBed.tick();
  });

  it('debe inicializar el formulario con campos vacíos e inválidos', () => {
    expect(component.loginForm.valid).toBe(false);
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  describe('Validaciones del Formulario', () => {
    it('debe marcar el email como inválido si el formato es incorrecto', () => {
      const emailControl = component.loginForm.get('email');

      emailControl?.setValue('correo-invalido');
      expect(emailControl?.hasError('email')).toBe(true);

      emailControl?.setValue('correo@valido.com');
      expect(emailControl?.hasError('email')).toBe(false);
    });

    it('debe marcar la contraseña como inválida si tiene menos de 6 caracteres', () => {
      const passwordControl = component.loginForm.get('password');

      passwordControl?.setValue('12345');
      expect(passwordControl?.hasError('minlength')).toBe(true);

      passwordControl?.setValue('123456');
      expect(passwordControl?.hasError('minlength')).toBe(false);
    });

    it('debe marcar todos los campos como tocados (touched) si se envía un formulario inválido', () => {
      expect(component.loginForm.touched).toBe(false);

      component.onSubmit();

      expect(component.loginForm.touched).toBe(true);
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });
  });

  // ==========================================
  // PRUEBAS DE COMPORTAMIENTO ASÍNCRONO Y DOM
  // ==========================================
  describe('Envío del Formulario (Submit)', () => {
    it('debe autenticar con éxito al usuario y redirigir al Home con datos válidos', () => {
      mockAuthService.login.mockReturnValue(of({}));

      component.loginForm.setValue({
        email: 'admin@ias.com.co',
        password: 'password123'
      });

      component.onSubmit();

      expect(component.isLoading()).toBe(false);
      expect(component.errorMessage()).toBeNull();

      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: 'admin@ias.com.co',
        password: 'password123'
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('debe capturar el error del backend y mapear el mensaje en la señal errorMessage', () => {
      const mockBackendError = {
        error: { message: 'Credenciales inválidas, intenta de nuevo.' }
      };
      mockAuthService.login.mockReturnValue(throwError(() => mockBackendError));

      component.loginForm.setValue({
        email: 'fail@angular.com',
        password: 'wrongpassword'
      });

      component.onSubmit();

      expect(component.isLoading()).toBe(false);
      expect(component.errorMessage()).toBe('Credenciales inválidas, intenta de nuevo.');
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('debe usar un mensaje genérico por defecto si el backend no envía la propiedad message', () => {
      mockAuthService.login.mockReturnValue(throwError(() => new Error('Fatal Network')));

      component.loginForm.setValue({
        email: 'fail@angular.com',
        password: 'wrongpassword'
      });

      component.onSubmit();

      expect(component.errorMessage()).toBe('Error de conexión con el servidor');
    });

    it('debe disparar todo el flujo extremo a extremo al presionar el botón de la UI', () => {
      mockAuthService.login.mockReturnValue(of({}));
      fixture.detectChanges();

      const emailInput = fixture.nativeElement.querySelector('[data-testid="email-input"]') as HTMLInputElement;
      const passwordInput = fixture.nativeElement.querySelector('[data-testid="password-input"]') as HTMLInputElement;
      const formEl = fixture.nativeElement.querySelector('[data-testid="login-form"]') as HTMLFormElement;

      emailInput.value = 'ui-test@angular.com';
      emailInput.dispatchEvent(new Event('input'));
      passwordInput.value = 'secret123';
      passwordInput.dispatchEvent(new Event('input'));

      TestBed.tick();
      fixture.detectChanges();

      formEl.dispatchEvent(new Event('submit'));

      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: 'ui-test@angular.com',
        password: 'secret123'
      });
    });
  });
});

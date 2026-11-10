import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginComponent } from './login.component';

const jest = vi;

describe('LoginComponent (Estándar Senior - Formularios y Rutas)', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn()
    };

    mockRouter = {
      navigate: jest.fn().mockResolvedValue(true)
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

    // Eliminamos el TestBed.tick() de aquí ya que no estamos en entorno fakeAsync global
    fixture.detectChanges();
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

  // =========================================================
  // COBERTURA COMPLEMENTARIA: VALIDACIONES DE PLANTILLA (@if)
  // =========================================================
  describe('Mensajes de Error del Formulario en el HTML', () => {
    it('debe renderizar el error "obligatorio" si el email está vacío y touched', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.markAsTouched();
      fixture.detectChanges();

      const errorEl = fixture.debugElement.query(By.css('#email-error'));
      expect(errorEl.nativeElement.textContent).toContain('El correo electrónico es obligatorio.');
    });

    it('debe renderizar el error "formato de correo inválido" si tiene errores de tipo email y touched', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('invalido@');
      emailControl?.markAsTouched();
      fixture.detectChanges();

      const errorEl = fixture.debugElement.query(By.css('#email-error'));
      expect(errorEl.nativeElement.textContent).toContain('Formato de correo inválido.');
    });

    it('debe renderizar el error "obligatorio" si la contraseña está vacía y touched', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.markAsTouched();
      fixture.detectChanges();

      const errorEl = fixture.debugElement.query(By.css('#password-error'));
      expect(errorEl.nativeElement.textContent).toContain('La contraseña es obligatoria.');
    });

    it('debe renderizar el error de longitud si la contraseña tiene menos de 6 caracteres y touched', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('123');
      passwordControl?.markAsTouched();
      fixture.detectChanges();

      const errorEl = fixture.debugElement.query(By.css('#password-error'));
      expect(errorEl.nativeElement.textContent).toContain('La contraseña debe tener al menos 6 caracteres.');
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

      // Cobertura del bloque HTML de alerta global
      fixture.detectChanges();
      const globalErrorEl = fixture.debugElement.query(By.css('[data-testid="error-message"]'));
      expect(globalErrorEl.nativeElement.textContent).toContain('Credenciales inválidas, intenta de nuevo.');

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('debe usar un mensaje genérico por defecto si el backend no envía la propiedad message o viene vacío', () => {
      // Modificado para cubrir rigurosamente la condición intermedia err.error?.message vacía
      mockAuthService.login.mockReturnValue(throwError(() => ({ error: {} })));

      component.loginForm.setValue({
        email: 'fail@angular.com',
        password: 'wrongpassword'
      });

      component.onSubmit();

      expect(component.errorMessage()).toBe('Error de conexión con el servidor');
    });

    // Añadida prueba para cubrir el estado de carga intermedio de las Signals y DOM
    it('debe deshabilitar el botón y mostrar el spinner visual mientras isLoading() es true', async () => {
      // 1. Creamos un Subject para controlar exactamente cuándo responde el servicio
      const loginResponse$ = new Subject<any>();
      mockAuthService.login.mockReturnValue(loginResponse$.asObservable());

      component.loginForm.setValue({
        email: 'loading-test@angular.com',
        password: 'password123'
      });

      // 2. Disparamos el envío (La petición queda "colgada" esperando respuesta)
      component.onSubmit();
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector('[data-testid="submit-button"]') as HTMLButtonElement;

      // Validamos con éxito el estado intermedio (Loading activo)
      expect(component.isLoading()).toBe(true);
      expect(submitButton.disabled).toBe(true);
      expect(submitButton.textContent).toContain('Iniciando sesión...');

      // 3. Emitimos el éxito en el flujo asíncrono de RxJS de manera inmediata
      loginResponse$.next({});
      loginResponse$.complete();

      // 4. Forzamos a que la microtarea de la suscripción se ejecute y Angular actualice el DOM
      await Promise.resolve();
      fixture.detectChanges();

      // Validamos el estado final (Loading apagado)
      expect(component.isLoading()).toBe(false);
      expect(submitButton.disabled).toBe(false);
    });


    // Corregida y encapsulada en fakeAsync para controlar los eventos nativos de input y tick
    it('debe disparar todo el flujo extremo a extremo al presionar el botón de la UI', async () => {
      mockAuthService.login.mockReturnValue(of({}));
      fixture.detectChanges();

      const emailInput = fixture.nativeElement.querySelector('[data-testid="email-input"]') as HTMLInputElement;
      const passwordInput = fixture.nativeElement.querySelector('[data-testid="password-input"]') as HTMLInputElement;
      const formEl = fixture.nativeElement.querySelector('[data-testid="login-form"]') as HTMLFormElement;

      emailInput.value = 'ui-test@angular.com';
      emailInput.dispatchEvent(new Event('input'));
      passwordInput.value = 'secret123';
      passwordInput.dispatchEvent(new Event('input'));

      // En Zoneless, detectamos los cambios de los inputs usando promesas
      await fixture.whenStable();
      fixture.detectChanges();

      formEl.dispatchEvent(new Event('submit'));

      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: 'ui-test@angular.com',
        password: 'secret123'
      });
    });
  });
});

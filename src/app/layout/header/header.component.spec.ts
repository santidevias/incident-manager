import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
const jest = vi;

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe emitir el evento toggleMenu cuando se llama a toggleMobileMenu()', () => {
    const emitSpy = jest.spyOn(component.toggleMenu, 'emit');

    component.toggleMobileMenu();
    expect(emitSpy).toHaveBeenCalled();
  });
});

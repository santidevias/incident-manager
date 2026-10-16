import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentModalFormComponent } from './incident-modal-form.component';

describe('IncidentModalFormComponent', () => {
  let component: IncidentModalFormComponent;
  let fixture: ComponentFixture<IncidentModalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentModalFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentModalFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

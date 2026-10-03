import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentFilterStatusComponent } from './incident-filter-status.component';

describe('IncidentFilterStatusComponent', () => {
  let component: IncidentFilterStatusComponent;
  let fixture: ComponentFixture<IncidentFilterStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentFilterStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentFilterStatusComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

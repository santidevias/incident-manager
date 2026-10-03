import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentFilterPriorityComponent } from './incident-filter-priority.component';

describe('IncidentFilterPriorityComponent', () => {
  let component: IncidentFilterPriorityComponent;
  let fixture: ComponentFixture<IncidentFilterPriorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentFilterPriorityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentFilterPriorityComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

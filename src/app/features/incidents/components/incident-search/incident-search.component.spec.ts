import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentSearchComponent } from './incident-search.component';

describe('IncidentSearchComponent', () => {
  let component: IncidentSearchComponent;
  let fixture: ComponentFixture<IncidentSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentSearchComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

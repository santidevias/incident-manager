import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentPaginationComponent } from './incident-pagination.component';

describe('IncidentPaginationComponent', () => {
  let component: IncidentPaginationComponent;
  let fixture: ComponentFixture<IncidentPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentPaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentPaginationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

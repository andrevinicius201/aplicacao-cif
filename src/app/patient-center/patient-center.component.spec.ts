import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCenterComponent } from './patient-center.component';

describe('PatientCenterComponent', () => {
  let component: PatientCenterComponent;
  let fixture: ComponentFixture<PatientCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

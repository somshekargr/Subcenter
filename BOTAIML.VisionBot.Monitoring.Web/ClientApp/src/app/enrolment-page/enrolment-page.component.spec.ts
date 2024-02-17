import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolmentPageComponent } from './enrolment-page.component';

describe('EnrolmentPageComponent', () => {
  let component: EnrolmentPageComponent;
  let fixture: ComponentFixture<EnrolmentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrolmentPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolmentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

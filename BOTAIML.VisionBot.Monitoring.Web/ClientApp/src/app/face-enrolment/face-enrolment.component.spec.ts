import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceEnrolmentComponent } from './face-enrolment.component';

describe('FaceEnrolmentComponent', () => {
  let component: FaceEnrolmentComponent;
  let fixture: ComponentFixture<FaceEnrolmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaceEnrolmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceEnrolmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

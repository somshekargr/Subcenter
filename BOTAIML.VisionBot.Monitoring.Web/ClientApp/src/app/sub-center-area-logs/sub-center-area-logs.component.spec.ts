import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCenterAreaLogsComponent } from './sub-center-area-logs.component';

describe('SubCenterAreaLogsComponent', () => {
  let component: SubCenterAreaLogsComponent;
  let fixture: ComponentFixture<SubCenterAreaLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubCenterAreaLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCenterAreaLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

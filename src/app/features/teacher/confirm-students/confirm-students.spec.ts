import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmStudents } from './confirm-students';

describe('ConfirmStudents', () => {
  let component: ConfirmStudents;
  let fixture: ComponentFixture<ConfirmStudents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmStudents],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmStudents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

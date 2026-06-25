import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassCode } from './class-code';

describe('ClassCode', () => {
  let component: ClassCode;
  let fixture: ComponentFixture<ClassCode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassCode],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassCode);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassCreated } from './class-created';

describe('ClassCreated', () => {
  let component: ClassCreated;
  let fixture: ComponentFixture<ClassCreated>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassCreated],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassCreated);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

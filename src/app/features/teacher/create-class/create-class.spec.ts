import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClass } from './create-class';

describe('CreateClass', () => {
  let component: CreateClass;
  let fixture: ComponentFixture<CreateClass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateClass],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateClass);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

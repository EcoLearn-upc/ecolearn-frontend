import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Classifier } from './classifier';

describe('Classifier', () => {
  let component: Classifier;
  let fixture: ComponentFixture<Classifier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Classifier],
    }).compileComponents();

    fixture = TestBed.createComponent(Classifier);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectName } from './select-name';

describe('SelectName', () => {
  let component: SelectName;
  let fixture: ComponentFixture<SelectName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectName],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectName);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

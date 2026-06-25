import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSelection } from './profile-selection';

describe('ProfileSelection', () => {
  let component: ProfileSelection;
  let fixture: ComponentFixture<ProfileSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileSelection],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileSelection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

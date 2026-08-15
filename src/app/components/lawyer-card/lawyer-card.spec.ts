import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LawyerCard } from './lawyer-card';

describe('LawyerCard', () => {
  let component: LawyerCard;
  let fixture: ComponentFixture<LawyerCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LawyerCard],
    }).compileComponents();

    fixture = TestBed.createComponent(LawyerCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

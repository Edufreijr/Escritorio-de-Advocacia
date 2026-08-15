import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lawyers } from './lawyers';

describe('Lawyers', () => {
  let component: Lawyers;
  let fixture: ComponentFixture<Lawyers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lawyers],
    }).compileComponents();

    fixture = TestBed.createComponent(Lawyers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

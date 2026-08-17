import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Areas } from './areas';

describe('Areas', () => {
  let component: Areas;
  let fixture: ComponentFixture<Areas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Areas],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Areas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

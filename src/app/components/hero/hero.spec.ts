import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Hero } from './hero';

describe('Hero', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hero],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Hero);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });
});

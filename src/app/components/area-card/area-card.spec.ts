import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AreaCard } from './area-card';

describe('AreaCard', () => {
  let component: AreaCard;
  let fixture: ComponentFixture<AreaCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AreaCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

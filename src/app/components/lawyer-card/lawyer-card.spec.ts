import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LawyerCard } from './lawyer-card';

describe('LawyerCard', () => {
  let component: LawyerCard;
  let fixture: ComponentFixture<LawyerCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LawyerCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LawyerCard);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('name', 'João da Silva');
    fixture.componentRef.setInput('role', 'Advogado');
    fixture.componentRef.setInput('description', 'Descrição do advogado');

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

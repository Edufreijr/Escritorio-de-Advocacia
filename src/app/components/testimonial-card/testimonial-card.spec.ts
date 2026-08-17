import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialCard } from './testimonial-card';

describe('TestimonialCard', () => {
  let component: TestimonialCard;
  let fixture: ComponentFixture<TestimonialCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialCard],
    }).compileComponents();

    fixture = TestBed.createComponent(TestimonialCard);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('name', 'João da Silva');
    fixture.componentRef.setInput('text', 'Excelente atendimento.');

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

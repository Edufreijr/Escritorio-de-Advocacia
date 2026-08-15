import { Component, input } from '@angular/core';

@Component({
  selector: 'app-testimonial-card',
  imports: [],
  templateUrl: './testimonial-card.html',
  styleUrl: './testimonial-card.css',
})
export class TestimonialCard {
  name = input.required<string>();
  text = input.required<string>();
}

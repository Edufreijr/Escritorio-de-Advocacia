import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lawyer-card',
  imports: [RouterLink],
  templateUrl: './lawyer-card.html',
  styleUrl: './lawyer-card.css',
})
export class LawyerCard {
  name = input.required<string>();
  role = input.required<string>();
  description = input.required<string>();
  specialties = input<string[]>([]);
  link = input<string>('/advogados');
}

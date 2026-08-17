import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Hero } from '../../components/hero/hero';
import { AreaCard } from '../../components/area-card/area-card';
import { LawyerCard } from '../../components/lawyer-card/lawyer-card';
import { TestimonialCard } from '../../components/testimonial-card/testimonial-card';

import { LawyerService } from '../../services/lawyer.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Hero, AreaCard, LawyerCard, TestimonialCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly lawyerService = inject(LawyerService);

  readonly lawyers = this.lawyerService.all;
}

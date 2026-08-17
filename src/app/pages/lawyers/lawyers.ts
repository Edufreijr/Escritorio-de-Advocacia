import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LawyerCard } from '../../components/lawyer-card/lawyer-card';
import { LawyerService } from '../../services/lawyer.service';

@Component({
  selector: 'app-lawyers',
  imports: [RouterLink, LawyerCard],
  templateUrl: './lawyers.html',
  styleUrl: './lawyers.css',
})
export class Lawyers {
  private readonly lawyerService = inject(LawyerService);

  readonly lawyers = this.lawyerService.all;
}

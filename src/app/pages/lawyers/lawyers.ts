import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LawyerCard } from '../../components/lawyer-card/lawyer-card';

@Component({
  selector: 'app-lawyers',
  imports: [RouterLink, LawyerCard],
  templateUrl: './lawyers.html',
  styleUrl: './lawyers.css',
})
export class Lawyers {}

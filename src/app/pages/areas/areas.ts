import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AreaCard } from '../../components/area-card/area-card';

@Component({
  selector: 'app-areas',
  imports: [RouterLink, AreaCard],
  templateUrl: './areas.html',
  styleUrl: './areas.css',
})
export class Areas {}

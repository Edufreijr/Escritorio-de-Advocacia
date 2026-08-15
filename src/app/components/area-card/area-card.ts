import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-area-card',
  imports: [RouterLink],
  templateUrl: './area-card.html',
  styleUrl: './area-card.css',
})
export class AreaCard {
  @Input() title = '';
  @Input() description = '';
  @Input() icon = '';
  @Input() link = '';
}

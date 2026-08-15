import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AppointmentForm } from '../../components/appointment-form/appointment-form';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-appointment',
  imports: [AppointmentForm, RouterLink],
  templateUrl: './appointment.html',
  styleUrl: './appointment.css',
})
export class Appointment {
  readonly authService = inject(AuthService);

  get isClient(): boolean {
    return this.authService.hasRole('user');
  }
}

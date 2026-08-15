import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { Appointment } from '../../interfaces/appointment';

@Component({
  selector: 'app-minha-conta',
  imports: [RouterLink],
  templateUrl: './minha-conta.html',
  styleUrl: './minha-conta.css',
})
export class MinhaConta {
  private readonly authService = inject(AuthService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly router = inject(Router);

  readonly user = this.authService.user;

  get myAppointments(): Appointment[] {
    const currentUser = this.user();

    if (!currentUser) {
      return [];
    }

    return this.appointmentService
      .getAll()
      .filter(
        (appointment) => appointment.email === currentUser.email,
      );
  }

  getStatusLabel(status: Appointment['status']): string {
    switch (status) {
      case 'pending':
        return 'Pendente';

      case 'confirmed':
        return 'Confirmado';

      case 'cancelled':
        return 'Cancelado';

      default:
        return status;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
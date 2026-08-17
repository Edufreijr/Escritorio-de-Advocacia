import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { ContactService } from '../../services/contact.service';
import { LawyerService } from '../../services/lawyer.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  private readonly authService = inject(AuthService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly contactService = inject(ContactService);
  private readonly lawyerService = inject(LawyerService);

  readonly user = this.authService.user;
  readonly appointments = this.appointmentService.all;
  readonly contacts = this.contactService.all;
  readonly lawyers = this.lawyerService.all;

  get usersCount(): number {
    return this.authService.getUsers().length;
  }

  get lawyersCount(): number {
    return this.lawyers().length;
  }

  get clientsCount(): number {
    return this.authService.getUsers().filter((user) => user.role === 'user').length;
  }

  get pendingAppointments(): number {
    return this.appointments().filter((appointment) => appointment.status === 'pending').length;
  }

  get confirmedAppointments(): number {
    return this.appointments().filter((appointment) => appointment.status === 'confirmed').length;
  }

  get cancelledAppointments(): number {
    return this.appointments().filter((appointment) => appointment.status === 'cancelled').length;
  }

  get newContacts(): number {
    return this.contacts().filter((contact) => contact.status === 'new').length;
  }

  get answeredContacts(): number {
    return this.contacts().filter((contact) => contact.status === 'answered').length;
  }

  get recentAppointments() {
    return [...this.appointments()].sort((a, b) => b.id - a.id).slice(0, 5);
  }

  get recentContacts() {
    return [...this.contacts()].sort((a, b) => b.id - a.id).slice(0, 5);
  }

  getStatusLabel(status: 'pending' | 'confirmed' | 'cancelled'): string {
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
}

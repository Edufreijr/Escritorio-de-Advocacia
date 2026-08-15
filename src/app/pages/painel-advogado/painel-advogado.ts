import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { Appointment } from '../../interfaces/appointment';

@Component({
  selector: 'app-painel-advogado',
  imports: [RouterLink],
  templateUrl: './painel-advogado.html',
  styleUrl: './painel-advogado.css',
})
export class PainelAdvogado {
  private readonly appointmentService = inject(AppointmentService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.authService.user;

  get appointments(): Appointment[] {
    const currentUser = this.user();

    if (!currentUser || currentUser.role !== 'lawyer') {
      return [];
    }

    return this.appointmentService.getByLawyerId(currentUser.id);
  }

  get totalAppointments(): number {
    return this.appointments.length;
  }

  get pendingAppointments(): number {
    return this.appointments.filter(
      (appointment) => appointment.status === 'pending',
    ).length;
  }

  get confirmedAppointments(): number {
    return this.appointments.filter(
      (appointment) => appointment.status === 'confirmed',
    ).length;
  }

  get cancelledAppointments(): number {
    return this.appointments.filter(
      (appointment) => appointment.status === 'cancelled',
    ).length;
  }

  confirmAppointment(id: number): void {
    this.appointmentService.updateStatus(id, 'confirmed');
  }

  cancelAppointment(id: number): void {
    this.appointmentService.updateStatus(id, 'cancelled');
  }

  removeAppointment(id: number): void {
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir este agendamento?',
    );

    if (!confirmed) {
      return;
    }

    this.appointmentService.remove(id);
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
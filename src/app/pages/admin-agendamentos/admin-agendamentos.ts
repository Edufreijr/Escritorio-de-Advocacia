import { Component, inject } from '@angular/core';

import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-admin-agendamentos',
  imports: [],
  templateUrl: './admin-agendamentos.html',
  styleUrl: './admin-agendamentos.css',
})
export class AdminAgendamentos {
  private readonly appointmentService = inject(AppointmentService);

  readonly appointments = this.appointmentService.all;

  removeAppointment(id: number): void {
    const confirmed = confirm(
      'Deseja realmente excluir este agendamento?',
    );

    if (!confirmed) {
      return;
    }

    this.appointmentService.remove(id);
  }

  get totalAppointments(): number {
    return this.appointments().length;
  }

  get pendingAppointments(): number {
    return this.appointments().filter(
      (appointment) => appointment.status === 'pending',
    ).length;
  }

  get confirmedAppointments(): number {
    return this.appointments().filter(
      (appointment) => appointment.status === 'confirmed',
    ).length;
  }

  get cancelledAppointments(): number {
    return this.appointments().filter(
      (appointment) => appointment.status === 'cancelled',
    ).length;
  }
}


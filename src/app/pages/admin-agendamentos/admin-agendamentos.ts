import { Component, inject } from '@angular/core';

import { AppointmentService } from '../../services/appointment.service';
import { LawyerService } from '../../services/lawyer.service';
import { Appointment } from '../../interfaces/appointment';

@Component({
  selector: 'app-admin-agendamentos',
  imports: [],
  templateUrl: './admin-agendamentos.html',
  styleUrl: './admin-agendamentos.css',
})
export class AdminAgendamentos {
  private readonly appointmentService = inject(AppointmentService);

  private readonly lawyerService = inject(LawyerService);

  readonly appointments = this.appointmentService.all;
  readonly lawyers = this.lawyerService.all;

  getLawyersForAppointment(appointment: Appointment) {
    return this.lawyers().filter((lawyer) => lawyer.specialties.includes(appointment.area));
  }

  removeAppointment(id: number): void {
    const confirmed = confirm('Deseja realmente excluir este agendamento?');

    if (!confirmed) {
      return;
    }

    this.appointmentService.remove(id);
  }

  assignLawyer(appointmentId: number, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const lawyerId = Number(select.value);

    if (!lawyerId) {
      this.appointmentService.removeLawyer(appointmentId);
      return;
    }

    const success = this.appointmentService.assignLawyer(appointmentId, lawyerId);

    if (!success) {
      const appointment = this.appointmentService.getById(appointmentId);

      if (appointment) {
        select.value = String(appointment.lawyerId ?? '');
      }
    }
  }

  removeLawyer(appointmentId: number): void {
    const confirmed = confirm('Deseja retirar o advogado deste atendimento?');

    if (!confirmed) {
      return;
    }

    this.appointmentService.removeLawyer(appointmentId);
  }

  getLawyerName(lawyerId?: number): string {
    if (lawyerId === undefined) {
      return 'Aguardando indicação';
    }

    return this.lawyerService.getById(lawyerId)?.name ?? 'Advogado não encontrado';
  }

  get totalAppointments(): number {
    return this.appointments().length;
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
}

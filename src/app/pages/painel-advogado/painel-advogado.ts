import { Component, inject } from '@angular/core';

import { Router, RouterLink } from '@angular/router';

import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { LawyerService } from '../../services/lawyer.service';

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

  private readonly lawyerService = inject(LawyerService);

  private readonly router = inject(Router);

  readonly user = this.authService.user;

  get assignedAppointments(): Appointment[] {
    const currentUser = this.user();

    if (!currentUser || currentUser.role !== 'lawyer') {
      return [];
    }

    const lawyer = this.lawyerService.getById(currentUser.id);

    if (!lawyer) {
      return [];
    }

    return this.appointmentService
      .getByLawyerId(currentUser.id)
      .filter((appointment) => lawyer.specialties.includes(appointment.area));
  }

  get unassignedAppointments(): Appointment[] {
    const currentUser = this.user();

    if (!currentUser || currentUser.role !== 'lawyer') {
      return [];
    }

    return this.appointmentService.getUnassignedForLawyer(currentUser.id);
  }

  get totalAppointments(): number {
    return this.assignedAppointments.length;
  }

  get pendingAppointments(): number {
    return this.assignedAppointments.filter((appointment) => appointment.status === 'pending')
      .length;
  }

  get confirmedAppointments(): number {
    return this.assignedAppointments.filter((appointment) => appointment.status === 'confirmed')
      .length;
  }

  get cancelledAppointments(): number {
    return this.assignedAppointments.filter((appointment) => appointment.status === 'cancelled')
      .length;
  }

  getLawyerName(lawyerId?: number): string {
    if (lawyerId === undefined) {
      return 'Aguardando indicação';
    }

    return this.lawyerService.getById(lawyerId)?.name ?? 'Advogado não encontrado';
  }

  isAssignedToCurrentLawyer(appointment: Appointment): boolean {
    const currentUser = this.user();

    return (
      !!currentUser && currentUser.role === 'lawyer' && appointment.lawyerId === currentUser.id
    );
  }

  claimAppointment(id: number): void {
    const currentUser = this.user();

    if (!currentUser || currentUser.role !== 'lawyer') {
      return;
    }

    const appointment = this.appointmentService.getById(id);

    if (!appointment || appointment.lawyerId !== undefined) {
      return;
    }

    const lawyer = this.lawyerService.getById(currentUser.id);

    if (
      !lawyer ||
      appointment.status !== 'pending' ||
      !lawyer.specialties.includes(appointment.area)
    ) {
      return;
    }

    this.appointmentService.assignLawyer(id, currentUser.id);
  }

  confirmAppointment(id: number): void {
    const appointment = this.appointmentService.getById(id);

    if (!appointment || !this.isAssignedToCurrentLawyer(appointment)) {
      return;
    }

    this.appointmentService.updateStatus(id, 'confirmed');
  }

  cancelAppointment(id: number): void {
    const appointment = this.appointmentService.getById(id);

    if (!appointment || !this.isAssignedToCurrentLawyer(appointment)) {
      return;
    }

    this.appointmentService.updateStatus(id, 'cancelled');
  }

  removeAppointment(id: number): void {
    const confirmed = window.confirm('Tem certeza que deseja excluir este agendamento?');

    if (!confirmed) {
      return;
    }

    const appointment = this.appointmentService.getById(id);

    if (!appointment || !this.isAssignedToCurrentLawyer(appointment)) {
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

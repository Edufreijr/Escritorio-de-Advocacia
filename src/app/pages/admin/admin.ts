import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../interfaces/appointment';
import { AuthService } from '../../services/auth.service';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../interfaces/contact';

@Component({
  selector: 'app-admin',
  imports: [RouterLink, DatePipe],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  private readonly appointmentService = inject(AppointmentService);
  private readonly contactService = inject(ContactService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  appointments = this.appointmentService.all;
  contacts = this.contactService.all;

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

  get totalContacts(): number {
    return this.contacts().length;
  }

  get newContacts(): number {
    return this.contacts().filter(
      (contact) => contact.status === 'new',
    ).length;
  }

  get readContacts(): number {
    return this.contacts().filter(
      (contact) => contact.status === 'read',
    ).length;
  }

  get answeredContacts(): number {
    return this.contacts().filter(
      (contact) => contact.status === 'answered',
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

  getContactStatusLabel(status: Contact['status']): string {
    switch (status) {
      case 'new':
        return 'Nova';

      case 'read':
        return 'Lida';

      case 'answered':
        return 'Respondida';

      default:
        return status;
    }
  }

  markContactAsRead(id: number): void {
    this.contactService.updateStatus(id, 'read');
  }

  markContactAsAnswered(id: number): void {
    this.contactService.updateStatus(id, 'answered');
  }

  removeContact(id: number): void {
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir esta mensagem?',
    );

    if (!confirmed) {
      return;
    }

    this.contactService.remove(id);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}



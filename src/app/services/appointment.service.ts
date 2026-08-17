import { inject, Injectable, signal } from '@angular/core';

import { Appointment } from '../interfaces/appointment';
import { generateSeedData } from '../data/seed.data';
import { LawyerService } from './lawyer.service';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private readonly storageKey = 'araujo-freitas-appointments';

  private readonly lawyerService = inject(LawyerService);

  private readonly appointments = signal<Appointment[]>(this.loadAppointments());

  readonly all = this.appointments.asReadonly();

  getAll(): Appointment[] {
    return this.appointments();
  }

  getById(id: number): Appointment | undefined {
    return this.appointments().find((appointment) => appointment.id === id);
  }

  getByUserId(userId: number): Appointment[] {
    return this.appointments().filter((appointment) => appointment.userId === userId);
  }

  getByLawyerId(lawyerId: number): Appointment[] {
    return this.appointments().filter((appointment) => appointment.lawyerId === lawyerId);
  }

  getUnassigned(): Appointment[] {
    return this.appointments().filter((appointment) => appointment.lawyerId === undefined);
  }

  getUnassignedForLawyer(lawyerId: number): Appointment[] {
    const lawyer = this.lawyerService.getById(lawyerId);

    if (!lawyer) {
      return [];
    }

    return this.appointments().filter(
      (appointment) =>
        appointment.lawyerId === undefined &&
        appointment.status === 'pending' &&
        lawyer.specialties.includes(appointment.area),
    );
  }

  add(appointment: Appointment): boolean {
    if (!this.isAppointmentTimeAllowed(appointment.date, appointment.time)) {
      return false;
    }

    if (
      appointment.lawyerId !== undefined &&
      !this.canAssignLawyer(appointment, appointment.lawyerId)
    ) {
      return false;
    }

    this.appointments.update((appointments) => [...appointments, appointment]);

    this.saveAppointments();

    return true;
  }

  assignLawyer(appointmentId: number, lawyerId: number): boolean {
    const appointment = this.getById(appointmentId);

    if (!appointment) {
      return false;
    }

    if (appointment.status === 'cancelled') {
      return false;
    }

    if (!this.canAssignLawyer(appointment, lawyerId)) {
      return false;
    }

    this.appointments.update((appointments) =>
      appointments.map((item) =>
        item.id === appointmentId
          ? {
              ...item,
              lawyerId,
            }
          : item,
      ),
    );

    this.saveAppointments();

    return true;
  }

  removeLawyer(appointmentId: number): boolean {
    const appointment = this.getById(appointmentId);

    if (!appointment) {
      return false;
    }

    this.appointments.update((appointments) =>
      appointments.map((item) => {
        if (item.id !== appointmentId) {
          return item;
        }

        const { ...appointmentWithoutLawyer } = item;

        delete appointmentWithoutLawyer.lawyerId;

        return {
          ...appointmentWithoutLawyer,
          status: item.status === 'confirmed' ? 'pending' : item.status,
        };
      }),
    );

    this.saveAppointments();

    return true;
  }

  removeLawyerAssignmentsOutsideAreas(lawyerId: number, specialties: string[]): void {
    const specialtySet = new Set(specialties);

    this.appointments.update((appointments) =>
      appointments.map((appointment) => {
        if (appointment.lawyerId !== lawyerId || specialtySet.has(appointment.area)) {
          return appointment;
        }

        const { ...appointmentWithoutLawyer } = appointment;

        delete appointmentWithoutLawyer.lawyerId;

        return {
          ...appointmentWithoutLawyer,
          status: appointment.status === 'confirmed' ? 'pending' : appointment.status,
        };
      }),
    );

    this.saveAppointments();
  }

  removeLawyerAssignments(lawyerId: number): void {
    this.appointments.update((appointments) =>
      appointments.map((appointment) => {
        if (appointment.lawyerId !== lawyerId) {
          return appointment;
        }

        const { ...appointmentWithoutLawyer } = appointment;

        delete appointmentWithoutLawyer.lawyerId;

        return {
          ...appointmentWithoutLawyer,
          status: appointment.status === 'confirmed' ? 'pending' : appointment.status,
        };
      }),
    );

    this.saveAppointments();
  }

  updateStatus(id: number, status: Appointment['status']): boolean {
    const appointment = this.getById(id);

    if (!appointment) {
      return false;
    }

    if (!this.isValidStatusTransition(appointment.status, status)) {
      return false;
    }

    if (status === 'confirmed' && appointment.lawyerId === undefined) {
      return false;
    }

    this.appointments.update((appointments) =>
      appointments.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
            }
          : item,
      ),
    );

    this.saveAppointments();

    return true;
  }

  remove(id: number): boolean {
    const appointment = this.getById(id);

    if (!appointment) {
      return false;
    }

    this.appointments.update((appointments) => appointments.filter((item) => item.id !== id));

    this.saveAppointments();

    return true;
  }

  removeByUserId(userId: number): void {
    this.appointments.update((appointments) =>
      appointments.filter((appointment) => appointment.userId !== userId),
    );

    this.saveAppointments();
  }

  hasLawyerConflict(
    lawyerId: number,
    date: string,
    time: string,
    excludeAppointmentId?: number,
  ): boolean {
    return this.appointments().some(
      (appointment) =>
        appointment.id !== excludeAppointmentId &&
        appointment.lawyerId === lawyerId &&
        appointment.date === date &&
        appointment.time === time &&
        appointment.status !== 'cancelled',
    );
  }

  isAppointmentTimeAllowed(date: string, time: string): boolean {
    const today = this.getToday();

    if (date < today) {
      return false;
    }

    if (date > today) {
      return true;
    }

    const [hours, minutes] = time.split(':').map(Number);

    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
      return false;
    }

    const now = new Date();

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const selectedMinutes = hours * 60 + minutes;

    return selectedMinutes > currentMinutes;
  }

  private canAssignLawyer(appointment: Appointment, lawyerId: number): boolean {
    const lawyer = this.lawyerService.getById(lawyerId);

    if (!lawyer) {
      return false;
    }

    if (!lawyer.specialties.includes(appointment.area)) {
      return false;
    }

    if (!this.isAppointmentTimeAllowed(appointment.date, appointment.time)) {
      return false;
    }

    return !this.hasLawyerConflict(lawyerId, appointment.date, appointment.time, appointment.id);
  }

  private isValidStatusTransition(
    current: Appointment['status'],
    next: Appointment['status'],
  ): boolean {
    if (current === next) {
      return false;
    }

    if (current === 'pending') {
      return next === 'confirmed' || next === 'cancelled';
    }

    if (current === 'confirmed') {
      return next === 'cancelled';
    }

    return false;
  }

  private getToday(): string {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, '0');

    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private saveAppointments(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.appointments()));
  }

  private loadAppointments(): Appointment[] {
    const seedData = generateSeedData();

    const storedAppointments = localStorage.getItem(this.storageKey);

    let appointments: Appointment[] = [];

    if (storedAppointments) {
      try {
        const parsedAppointments = JSON.parse(storedAppointments);

        if (Array.isArray(parsedAppointments)) {
          appointments = parsedAppointments.filter(
            (appointment): appointment is Appointment =>
              !!appointment &&
              typeof appointment.id === 'number' &&
              typeof appointment.userId === 'number' &&
              (typeof appointment.lawyerId === 'number' ||
                typeof appointment.lawyerId === 'undefined') &&
              typeof appointment.name === 'string' &&
              typeof appointment.email === 'string' &&
              typeof appointment.phone === 'string' &&
              typeof appointment.area === 'string' &&
              typeof appointment.date === 'string' &&
              typeof appointment.time === 'string' &&
              typeof appointment.message === 'string' &&
              ['pending', 'confirmed', 'cancelled'].includes(appointment.status),
          );
        }
      } catch {
        appointments = [];
      }
    }

    for (const seedAppointment of seedData.appointments) {
      const index = appointments.findIndex((appointment) => appointment.id === seedAppointment.id);

      if (index === -1) {
        appointments.push(seedAppointment);
      } else {
        appointments[index] = seedAppointment;
      }
    }

    localStorage.setItem(this.storageKey, JSON.stringify(appointments));

    return appointments;
  }
}

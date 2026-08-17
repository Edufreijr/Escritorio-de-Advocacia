import { Injectable, signal } from '@angular/core';

import { Appointment } from '../interfaces/appointment';
import { generateSeedData } from '../data/seed.data';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private readonly storageKey =
    'araujo-freitas-appointments';

  private readonly appointments =
    signal<Appointment[]>(
      this.loadAppointments(),
    );

  readonly all =
    this.appointments.asReadonly();

  getAll(): Appointment[] {
    return this.appointments();
  }

  getById(
    id: number,
  ): Appointment | undefined {
    return this.appointments().find(
      (appointment) =>
        appointment.id === id,
    );
  }

  getByUserId(
    userId: number,
  ): Appointment[] {
    return this.appointments().filter(
      (appointment) =>
        appointment.userId === userId,
    );
  }

  getByLawyerId(
    lawyerId: number,
  ): Appointment[] {
    return this.appointments().filter(
      (appointment) =>
        appointment.lawyerId === lawyerId,
    );
  }

  add(appointment: Appointment): void {
    this.appointments.update(
      (appointments) => [
        ...appointments,
        appointment,
      ],
    );

    this.saveAppointments();
  }

  updateStatus(
    id: number,
    status: Appointment['status'],
  ): boolean {
    const appointment = this.getById(id);

    if (!appointment) {
      return false;
    }

    this.appointments.update(
      (appointments) =>
        appointments.map((item) =>
          item.id === id
            ? { ...item, status }
            : item,
        ),
    );

    this.saveAppointments();

    return true;
  }

  remove(id: number): boolean {
    const appointment =
      this.getById(id);

    if (!appointment) {
      return false;
    }

    this.appointments.update(
      (appointments) =>
        appointments.filter(
          (item) => item.id !== id,
        ),
    );

    this.saveAppointments();

    return true;
  }

  removeByUserId(userId: number): void {
    this.appointments.update(
      (appointments) =>
        appointments.filter(
          (appointment) =>
            appointment.userId !== userId,
        ),
    );

    this.saveAppointments();
  }

  private saveAppointments(): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(
        this.appointments(),
      ),
    );
  }

  private loadAppointments(): Appointment[] {
    const seedData = generateSeedData();

    const storedAppointments =
      localStorage.getItem(
        this.storageKey,
      );

    let appointments: Appointment[] = [];

    if (storedAppointments) {
      try {
        const parsedAppointments =
          JSON.parse(
            storedAppointments,
          );

        if (Array.isArray(parsedAppointments)) {
          appointments =
            parsedAppointments.filter(
              (
                appointment,
              ): appointment is Appointment =>
                !!appointment &&
                typeof appointment.id ===
                  'number' &&
                typeof appointment.userId ===
                  'number' &&
                (
                  typeof appointment.lawyerId ===
                    'number' ||
                  typeof appointment.lawyerId ===
                    'undefined'
                ) &&
                typeof appointment.name ===
                  'string' &&
                typeof appointment.email ===
                  'string' &&
                typeof appointment.phone ===
                  'string' &&
                typeof appointment.area ===
                  'string' &&
                typeof appointment.date ===
                  'string' &&
                typeof appointment.time ===
                  'string' &&
                typeof appointment.message ===
                  'string' &&
                [
                  'pending',
                  'confirmed',
                  'cancelled',
                ].includes(
                  appointment.status,
                ),
            );
        }
      } catch {
        appointments = [];
      }
    }

    for (const seedAppointment of seedData.appointments) {
      const index =
        appointments.findIndex(
          (appointment) =>
            appointment.id ===
            seedAppointment.id,
        );

      if (index === -1) {
        appointments.push(
          seedAppointment,
        );
      } else {
        appointments[index] =
          seedAppointment;
      }
    }

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(appointments),
    );

    return appointments;
  }
}
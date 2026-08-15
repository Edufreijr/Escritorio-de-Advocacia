import { TestBed } from '@angular/core/testing';

import { AppointmentService } from './appointment.service';
import { Appointment } from '../interfaces/appointment';

describe('AppointmentService', () => {
  let service: AppointmentService;

  const appointment: Appointment = {
    id: 1,
    name: 'João da Silva',
    email: 'joao@email.com',
    phone: '(22) 99999-9999',
    area: 'Direito de Família',
    date: '2026-08-20',
    time: '14:00',
    message: 'Gostaria de agendar uma consulta.',
    status: 'pending',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(AppointmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an empty list initially', () => {
    expect(service.getAll()).toEqual([]);
  });

  it('should add an appointment', () => {
    service.add(appointment);

    expect(service.getAll()).toEqual([appointment]);
  });

  it('should return an appointment by id', () => {
    service.add(appointment);

    const result = service.getById(1);

    expect(result).toEqual(appointment);
  });

  it('should return undefined when the appointment does not exist', () => {
    const result = service.getById(999);

    expect(result).toBeUndefined();
  });

  it('should update the appointment status', () => {
    service.add(appointment);

    const updated = service.updateStatus(1, 'confirmed');

    expect(updated).toBe(true);
    expect(service.getById(1)?.status).toBe('confirmed');
  });

  it('should return false when updating a nonexistent appointment', () => {
    const updated = service.updateStatus(999, 'confirmed');

    expect(updated).toBe(false);
  });

  it('should remove an appointment', () => {
    service.add(appointment);

    const removed = service.remove(1);

    expect(removed).toBe(true);
    expect(service.getAll()).toEqual([]);
  });

  it('should return false when removing a nonexistent appointment', () => {
    const removed = service.remove(999);

    expect(removed).toBe(false);
  });
});

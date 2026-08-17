import { TestBed } from '@angular/core/testing';

import { AppointmentService } from './appointment.service';
import { Appointment } from '../interfaces/appointment';

describe('AppointmentService', () => {
  let service: AppointmentService;

  const appointment: Appointment = {
    id: 1,
    userId: 10,
    name: 'João da Silva',
    email: 'joao@email.com',
    phone: '11999999999',
    area: 'Direito Civil',
    date: '2026-08-20',
    time: '10:00',
    message: 'Preciso de orientação jurídica.',
    status: 'pending',
  };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({});

    service = TestBed.inject(AppointmentService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve adicionar um agendamento', () => {
    service.add(appointment);

    expect(service.getById(appointment.id)).toEqual(appointment);
  });

  it('deve buscar todos os agendamentos', () => {
    service.add(appointment);

    expect(service.getAll()).toContainEqual(appointment);
  });

  it('deve buscar agendamentos pelo usuário', () => {
    service.add(appointment);

    expect(service.getByUserId(appointment.userId)).toContainEqual(appointment);
  });
});

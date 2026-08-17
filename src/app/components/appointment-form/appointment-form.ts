import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../interfaces/appointment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-appointment-form',
  imports: [ReactiveFormsModule],
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.css',
})
export class AppointmentForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly appointmentService = inject(AppointmentService);
  private readonly authService = inject(AuthService);

  submitted = false;
  successMessage = '';
  errorMessage = '';

  minDate = this.getToday();

  appointmentForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(10)]],
    area: ['', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  constructor() {
    const user = this.authService.getCurrentUser();

    if (user && user.role === 'user') {
      this.appointmentForm.patchValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
    }

    this.appointmentForm.controls.date.valueChanges.subscribe((date) => {
      if (!date) {
        return;
      }

      this.successMessage = '';
      this.errorMessage = '';

      if (this.isPastDate(date)) {
        this.appointmentForm.controls.date.setValue('', {
          emitEvent: false,
        });

        this.errorMessage =
          'Não é possível escolher uma data anterior a hoje.';

        return;
      }

      if (this.isWeekend(date)) {
        this.appointmentForm.controls.date.setValue('', {
          emitEvent: false,
        });

        this.errorMessage =
          'Não é possível agendar consultas aos sábados e domingos.';
      }
    });
  }

  private getToday(): string {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private isPastDate(date: string): boolean {
    return date < this.minDate;
  }

  private isWeekend(date: string): boolean {
    const selectedDate = new Date(`${date}T00:00:00`);
    const dayOfWeek = selectedDate.getDay();

    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  submit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    const user = this.authService.getCurrentUser();

    if (!user || user.role !== 'user') {
      this.errorMessage =
        'É necessário estar cadastrado e conectado como cliente para realizar um agendamento.';
      return;
    }

    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();

      if (!this.errorMessage) {
        this.errorMessage = 'Preencha corretamente todos os campos.';
      }

      return;
    }

    const formValue = this.appointmentForm.getRawValue();
    const selectedDate = formValue.date ?? '';

    if (this.isPastDate(selectedDate)) {
      this.errorMessage =
        'Não é possível agendar uma consulta para uma data anterior a hoje.';
      return;
    }

    if (this.isWeekend(selectedDate)) {
      this.errorMessage =
        'Não é possível agendar consultas aos sábados e domingos.';
      return;
    }

    const appointment: Appointment = {
      id: Date.now(),
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      area: formValue.area ?? '',
      date: selectedDate,
      time: formValue.time ?? '',
      message: formValue.message ?? '',
      status: 'pending',
    };

    this.appointmentService.add(appointment);

    this.successMessage =
      'Sua solicitação de agendamento foi enviada com sucesso.';

    this.appointmentForm.reset();

    this.appointmentForm.patchValue({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });

    this.submitted = false;
  }

  isInvalid(field: string): boolean {
    const control = this.appointmentForm.get(field);

    return !!control && control.invalid && (control.touched || this.submitted);
  }
}
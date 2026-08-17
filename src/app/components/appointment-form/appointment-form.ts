import { Component, inject } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../interfaces/appointment';
import { AuthService } from '../../services/auth.service';
import { LawyerService } from '../../services/lawyer.service';
import { Lawyer } from '../../interfaces/lawyer';

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

  private readonly lawyerService = inject(LawyerService);

  submitted = false;

  successMessage = '';

  errorMessage = '';

  minDate = this.getToday();

  lawyers: Lawyer[] = [];

  appointmentForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],

    email: ['', [Validators.required, Validators.email]],

    phone: ['', [Validators.required, Validators.minLength(10)]],

    area: ['', Validators.required],

    lawyerChoice: ['office', Validators.required],

    lawyerId: [''],

    date: ['', Validators.required],

    time: ['', Validators.required],

    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  constructor() {
    this.lawyers = this.lawyerService.getAll();

    const user = this.authService.getCurrentUser();

    if (user && user.role === 'user') {
      this.appointmentForm.patchValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
    }

    this.appointmentForm.controls.area.valueChanges.subscribe(() => {
      this.updateLawyerList();
    });

    this.appointmentForm.controls.lawyerChoice.valueChanges.subscribe((choice) => {
      this.handleLawyerChoice(choice);
    });

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

        this.errorMessage = 'Não é possível escolher uma data anterior a hoje.';

        return;
      }

      if (this.isWeekend(date)) {
        this.appointmentForm.controls.date.setValue('', {
          emitEvent: false,
        });

        this.errorMessage = 'Não é possível agendar consultas aos sábados e domingos.';
      }
    });
  }

  get filteredLawyers(): Lawyer[] {
    const area = this.appointmentForm.controls.area.value;

    if (!area) {
      return this.lawyers;
    }

    return this.lawyers.filter((lawyer) => lawyer.specialties.includes(area));
  }

  get wantsSpecificLawyer(): boolean {
    return this.appointmentForm.controls.lawyerChoice.value === 'specific';
  }

  private updateLawyerList(): void {
    const currentLawyerId = this.appointmentForm.controls.lawyerId.value;

    const exists = this.filteredLawyers.some(
      (lawyer) => String(lawyer.id) === String(currentLawyerId),
    );

    if (!exists) {
      this.appointmentForm.controls.lawyerId.setValue('', {
        emitEvent: false,
      });
    }
  }

  private handleLawyerChoice(choice: string | null): void {
    const lawyerControl = this.appointmentForm.controls.lawyerId;

    if (choice === 'specific') {
      lawyerControl.setValidators(Validators.required);
    } else {
      lawyerControl.clearValidators();

      lawyerControl.setValue('', {
        emitEvent: false,
      });
    }

    lawyerControl.updateValueAndValidity();
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
      this.errorMessage = 'Não é possível agendar uma consulta para uma data anterior a hoje.';

      return;
    }

    if (this.isWeekend(selectedDate)) {
      this.errorMessage = 'Não é possível agendar consultas aos sábados e domingos.';

      return;
    }

    let lawyerId: number | undefined = undefined;

    if (formValue.lawyerChoice === 'specific') {
      const selectedLawyer = this.lawyers.find(
        (lawyer) => String(lawyer.id) === String(formValue.lawyerId),
      );

      if (!selectedLawyer) {
        this.errorMessage = 'Selecione um advogado válido para continuar.';

        return;
      }

      const selectedArea = formValue.area ?? '';

      if (!selectedLawyer.specialties.includes(selectedArea)) {
        this.errorMessage = 'O advogado selecionado não atende à área jurídica escolhida.';

        return;
      }

      lawyerId = selectedLawyer.id;
    }

    const appointment: Appointment = {
      id: Date.now(),

      userId: user.id,

      ...(lawyerId !== undefined
        ? {
            lawyerId,
          }
        : {}),

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

    if (lawyerId !== undefined) {
      this.successMessage =
        'Sua solicitação foi enviada ao advogado selecionado e está aguardando confirmação.';
    } else {
      this.successMessage =
        'Sua solicitação foi enviada. Nossa equipe irá indicar um advogado adequado para o seu caso.';
    }

    this.appointmentForm.reset({
      lawyerChoice: 'office',
    });

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

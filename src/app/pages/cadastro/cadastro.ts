import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  submitted = false;
  errorMessage = '';

  cadastroForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(10)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      return;
    }

    const name = this.cadastroForm.value.name ?? '';
    const email = this.cadastroForm.value.email ?? '';
    const phone = this.cadastroForm.value.phone ?? '';
    const password = this.cadastroForm.value.password ?? '';
    const confirmPassword = this.cadastroForm.value.confirmPassword ?? '';

    if (password !== confirmPassword) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }

    if (this.authService.isEmailRegistered(email)) {
      this.errorMessage = 'Este e-mail já está cadastrado. Faça login para continuar.';
      return;
    }

    const user = this.authService.register(name, email, phone, password);

    if (!user) {
      this.errorMessage = 'Não foi possível realizar o cadastro.';
      return;
    }

    this.router.navigate(['/agendamento']);
  }

  isInvalid(field: string): boolean {
    const control = this.cadastroForm.get(field);

    return !!control && control.invalid && (control.touched || this.submitted);
  }
}

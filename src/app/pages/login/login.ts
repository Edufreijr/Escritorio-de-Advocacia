import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  submitted = false;
  errorMessage = '';

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';

    const user = this.authService.authenticate(
      email,
      password,
    );

    if (!user) {
      this.errorMessage = 'E-mail ou senha incorretos.';
      return;
    }

    switch (user.role) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;

      case 'lawyer':
        this.router.navigate(['/painel-advogado']);
        break;

      case 'user':
        this.router.navigate(['/minha-conta']);
        break;
    }
  }

  isInvalid(field: string): boolean {
    const control = this.loginForm.get(field);

    return !!control && control.invalid && (control.touched || this.submitted);
  }
}




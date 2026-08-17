import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ContactService } from '../../services/contact.service';
import { Contact } from '../../interfaces/contact';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly contactService = inject(ContactService);

  submitted = false;
  successMessage = '';
  errorMessage = '';

  contactForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(10)]],
    subject: ['', [Validators.required, Validators.minLength(3)]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  submit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.errorMessage = 'Preencha corretamente todos os campos.';
      return;
    }

    const formValue = this.contactForm.getRawValue();

    const contact: Contact = {
      id: Date.now(),
      name: formValue.name ?? '',
      email: formValue.email ?? '',
      phone: formValue.phone ?? '',
      subject: formValue.subject ?? '',
      message: formValue.message ?? '',
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    this.contactService.add(contact);

    this.successMessage = 'Sua mensagem foi enviada com sucesso. Em breve entraremos em contato.';

    this.contactForm.reset();
    this.submitted = false;
  }

  isInvalid(field: string): boolean {
    const control = this.contactForm.get(field);

    return !!control && control.invalid && (control.touched || this.submitted);
  }
}

import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-admin-mensagens',
  imports: [DatePipe],
  templateUrl: './admin-mensagens.html',
  styleUrl: './admin-mensagens.css',
})
export class AdminMensagens {
  private readonly contactService = inject(ContactService);

  readonly contacts = this.contactService.all;

  removeContact(id: number): void {
    const confirmed = confirm('Deseja realmente excluir esta mensagem?');

    if (!confirmed) {
      return;
    }

    this.contactService.remove(id);
  }

  get totalContacts(): number {
    return this.contacts().length;
  }

  get newContacts(): number {
    return this.contacts().filter((contact) => contact.status === 'new').length;
  }

  get readContacts(): number {
    return this.contacts().filter((contact) => contact.status === 'read').length;
  }

  get answeredContacts(): number {
    return this.contacts().filter((contact) => contact.status === 'answered').length;
  }
}

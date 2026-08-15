import { Injectable, signal } from '@angular/core';

import { Contact } from '../interfaces/contact';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly storageKey = 'araujo-freitas-contacts';

  private readonly contacts = signal<Contact[]>(
    this.loadContacts(),
  );

  readonly all = this.contacts.asReadonly();

  getAll(): Contact[] {
    return this.contacts();
  }

  getById(id: number): Contact | undefined {
    return this.contacts().find(
      (contact) => contact.id === id,
    );
  }

  add(contact: Contact): void {
    this.contacts.update((contacts) => [
      ...contacts,
      contact,
    ]);

    this.saveContacts();
  }

  updateStatus(
    id: number,
    status: Contact['status'],
  ): boolean {
    const contact = this.getById(id);

    if (!contact) {
      return false;
    }

    this.contacts.update((contacts) =>
      contacts.map((item) =>
        item.id === id
          ? { ...item, status }
          : item,
      ),
    );

    this.saveContacts();

    return true;
  }

  remove(id: number): boolean {
    const contact = this.getById(id);

    if (!contact) {
      return false;
    }

    this.contacts.update((contacts) =>
      contacts.filter((item) => item.id !== id),
    );

    this.saveContacts();

    return true;
  }

  private saveContacts(): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.contacts()),
    );
  }

  private loadContacts(): Contact[] {
    const storedContacts = localStorage.getItem(
      this.storageKey,
    );

    if (!storedContacts) {
      return [];
    }

    try {
      const parsedContacts = JSON.parse(
        storedContacts,
      );

      if (!Array.isArray(parsedContacts)) {
        return [];
      }

      return parsedContacts as Contact[];
    } catch {
      localStorage.removeItem(this.storageKey);
      return [];
    }
  }
}

import { Injectable, signal } from '@angular/core';

import { Contact } from '../interfaces/contact';
import { generateSeedData } from '../data/seed.data';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly storageKey = 'araujo-freitas-contacts';

  private readonly contacts = signal<Contact[]>(this.loadContacts());

  readonly all = this.contacts.asReadonly();

  getAll(): Contact[] {
    return this.contacts();
  }

  getById(id: number): Contact | undefined {
    return this.contacts().find((contact) => contact.id === id);
  }

  add(contact: Contact): void {
    this.contacts.update((contacts) => [...contacts, contact]);

    this.saveContacts();
  }

  updateStatus(id: number, status: Contact['status']): boolean {
    const contact = this.getById(id);

    if (!contact) {
      return false;
    }

    this.contacts.update((contacts) =>
      contacts.map((item) => (item.id === id ? { ...item, status } : item)),
    );

    this.saveContacts();

    return true;
  }

  remove(id: number): boolean {
    const contact = this.getById(id);

    if (!contact) {
      return false;
    }

    this.contacts.update((contacts) => contacts.filter((item) => item.id !== id));

    this.saveContacts();

    return true;
  }

  removeByEmail(email: string): void {
    this.contacts.update((contacts) =>
      contacts.filter((contact) => contact.email.toLowerCase() !== email.toLowerCase()),
    );

    this.saveContacts();
  }

  private saveContacts(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.contacts()));
  }

  private loadContacts(): Contact[] {
    const seedData = generateSeedData();

    const storedContacts = localStorage.getItem(this.storageKey);

    let contacts: Contact[] = [];

    if (storedContacts) {
      try {
        const parsedContacts = JSON.parse(storedContacts);

        if (Array.isArray(parsedContacts)) {
          contacts = parsedContacts.filter(
            (contact): contact is Contact =>
              !!contact &&
              typeof contact.id === 'number' &&
              typeof contact.name === 'string' &&
              typeof contact.email === 'string' &&
              typeof contact.phone === 'string' &&
              typeof contact.subject === 'string' &&
              typeof contact.message === 'string' &&
              typeof contact.createdAt === 'string' &&
              ['new', 'read', 'answered'].includes(contact.status),
          );
        }
      } catch {
        contacts = [];
      }
    }

    for (const seedContact of seedData.contacts) {
      const index = contacts.findIndex((contact) => contact.id === seedContact.id);

      if (index === -1) {
        contacts.push(seedContact);
      } else {
        contacts[index] = seedContact;
      }
    }

    localStorage.setItem(this.storageKey, JSON.stringify(contacts));

    return contacts;
  }
}

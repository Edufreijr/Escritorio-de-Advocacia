import { TestBed } from '@angular/core/testing';

import { ContactService } from './contact.service';
import { Contact } from '../interfaces/contact';

describe('ContactService', () => {
  let service: ContactService;

  const createContact = (id: number): Contact => ({
    id,
    name: 'João da Silva',
    email: 'joao@email.com',
    phone: '(11) 99999-9999',
    subject: 'Consulta jurídica',
    message: 'Gostaria de agendar uma consulta.',
    createdAt: '2026-08-13T20:00:00.000Z',
    status: 'new',
  });

  beforeEach(() => {
    localStorage.removeItem('araujo-freitas-contacts');

    TestBed.configureTestingModule({});

    service = TestBed.inject(ContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a contact', () => {
    const contact = createContact(999);

    const initialLength = service.getAll().length;

    service.add(contact);

    expect(service.getAll().length).toBe(initialLength + 1);
    expect(service.getById(999)).toEqual(contact);
  });

  it('should return a contact by id', () => {
    const contact = createContact(999);

    service.add(contact);

    expect(service.getById(999)).toEqual(contact);
  });

  it('should return undefined when the contact does not exist', () => {
    expect(service.getById(999999)).toBeUndefined();
  });

  it('should remove an existing contact', () => {
    const contact = createContact(999);

    service.add(contact);

    const removed = service.remove(999);

    expect(removed).toBe(true);
    expect(service.getById(999)).toBeUndefined();
  });

  it('should return false when trying to remove a contact that does not exist', () => {
    expect(service.remove(999999)).toBe(false);
  });
});

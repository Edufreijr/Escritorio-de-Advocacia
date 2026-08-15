import { TestBed } from '@angular/core/testing';

import { ContactService } from './contact.service';
import { Contact } from '../interfaces/contact';

describe('ContactService', () => {
  let service: ContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(ContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a contact', () => {
    const contact: Contact = {
      id: 1,
      name: 'João da Silva',
      email: 'joao@email.com',
      phone: '(11) 99999-9999',
      subject: 'Consulta jurídica',
      message: 'Gostaria de agendar uma consulta.',
      createdAt: '2026-08-13T20:00:00.000Z',
      status: 'new',
    };

    service.add(contact);

    expect(service.getAll().length).toBe(1);
    expect(service.getAll()[0]).toEqual(contact);
  });

  it('should return a contact by id', () => {
    const contact: Contact = {
      id: 1,
      name: 'João da Silva',
      email: 'joao@email.com',
      phone: '(11) 99999-9999',
      subject: 'Consulta jurídica',
      message: 'Gostaria de agendar uma consulta.',
      createdAt: '2026-08-13T20:00:00.000Z',
      status: 'new',
    };

    service.add(contact);

    const result = service.getById(1);

    expect(result).toEqual(contact);
  });

  it('should return undefined when the contact does not exist', () => {
    const result = service.getById(999);

    expect(result).toBeUndefined();
  });

  it('should remove an existing contact', () => {
    const contact: Contact = {
      id: 1,
      name: 'João da Silva',
      email: 'joao@email.com',
      phone: '(11) 99999-9999',
      subject: 'Consulta jurídica',
      message: 'Gostaria de agendar uma consulta.',
      createdAt: '2026-08-13T20:00:00.000Z',
      status: 'new',
    };

    service.add(contact);

    const removed = service.remove(1);

    expect(removed).toBe(true);
    expect(service.getAll().length).toBe(0);
  });

  it('should return false when trying to remove a contact that does not exist', () => {
    const removed = service.remove(999);

    expect(removed).toBe(false);
  });
});

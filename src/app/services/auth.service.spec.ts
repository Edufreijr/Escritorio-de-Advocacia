import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { User } from '../interfaces/user';

describe('AuthService', () => {
  let service: AuthService;

  const user: User = {
    id: 1,
    name: 'Administrador',
    email: 'admin@araujoefreitas.com.br',
    password: '123456',
    role: 'admin',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be logged in initially', () => {
    expect(service.isLoggedIn()).toBe(false);
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should login a user', () => {
    service.login(user);

    expect(service.isLoggedIn()).toBe(true);
    expect(service.getCurrentUser()).toEqual(user);
  });

  it('should logout the current user', () => {
    service.login(user);

    service.logout();

    expect(service.isLoggedIn()).toBe(false);
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should expose the current user through the signal', () => {
    service.login(user);

    expect(service.user()).toEqual(user);
  });
});

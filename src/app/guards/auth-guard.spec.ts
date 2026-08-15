import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { authGuard } from './auth-guard';
import { AuthService } from '../services/auth.service';
import { User } from '../interfaces/user';

describe('authGuard', () => {
  let authService: AuthService;

  const user: User = {
    id: 1,
    name: 'Administrador',
    email: 'admin@araujoefreitas.com.br',
    password: '123456',
    role: 'admin',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: Router,
          useValue: {
            createUrlTree: (commands: string[]) => ({
              commands,
            }),
          },
        },
      ],
    });

    authService = TestBed.inject(AuthService);
  });

  it('should allow an authenticated user', () => {
    authService.login(user);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, {} as never),
    );

    expect(result).toBe(true);
  });

  it('should redirect an unauthenticated user to login', () => {
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, {} as never),
    );

    expect(result).toEqual({
      commands: ['/login'],
    });
  });
});

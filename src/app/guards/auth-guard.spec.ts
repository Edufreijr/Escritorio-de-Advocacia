import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { authGuard } from './auth-guard';
import { AuthService } from '../services/auth.service';
import { User } from '../interfaces/user';

describe('authGuard', () => {
  let authService: {
    isLoggedIn: ReturnType<typeof vi.fn>;
    getCurrentUser: ReturnType<typeof vi.fn>;
  };

  let router: {
    createUrlTree: ReturnType<typeof vi.fn>;
  };

  const user: User = {
    id: 1,
    name: 'Administrador',
    email: 'admin@teste.com',
    phone: '(11) 99999-9999',
    password: '123456',
    role: 'admin',
  };

  beforeEach(() => {
    authService = {
      isLoggedIn: vi.fn(),
      getCurrentUser: vi.fn(),
    };

    router = {
      createUrlTree: vi.fn((commands: string[]) => commands),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: Router,
          useValue: router,
        },
      ],
    });
  });

  it('deve permitir acesso quando o usuário está autenticado e possui a permissão', () => {
    authService.isLoggedIn.mockReturnValue(true);
    authService.getCurrentUser.mockReturnValue(user);

    const guard = authGuard(['admin']);

    const result = TestBed.runInInjectionContext(() => guard({} as never, {} as never));

    expect(result).toBe(true);
  });

  it('deve redirecionar para login quando não existe usuário autenticado', () => {
    authService.isLoggedIn.mockReturnValue(false);

    const guard = authGuard(['admin']);

    const result = TestBed.runInInjectionContext(() => guard({} as never, {} as never));

    expect(result).toEqual(['/login']);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
  });

  it('deve redirecionar quando o usuário não possui permissão', () => {
    authService.isLoggedIn.mockReturnValue(true);
    authService.getCurrentUser.mockReturnValue({
      ...user,
      role: 'user',
    });

    const guard = authGuard(['admin']);

    const result = TestBed.runInInjectionContext(() => guard({} as never, {} as never));

    expect(result).toEqual(['/minha-conta']);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/minha-conta']);
  });
});

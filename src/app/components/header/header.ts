import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly authService = inject(AuthService);

  get panelRoute(): string {
    const user = this.authService.getCurrentUser();

    switch (user?.role) {
      case 'admin':
        return '/admin';

      case 'lawyer':
        return '/painel-advogado';

      case 'user':
        return '/minha-conta';

      default:
        return '/login';
    }
  }

  get panelLabel(): string {
    const user = this.authService.getCurrentUser();

    switch (user?.role) {
      case 'admin':
        return 'Painel Admin';

      case 'lawyer':
        return 'Painel do Advogado';

      case 'user':
        return 'Minha Conta';

      default:
        return 'Login';
    }
  }
}

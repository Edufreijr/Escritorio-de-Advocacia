import { Component, inject } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-admin-usuarios',
  imports: [],
  templateUrl: './admin-usuarios.html',
  styleUrl: './admin-usuarios.css',
})
export class AdminUsuarios {
  private readonly authService = inject(AuthService);

  get users(): User[] {
    return this.authService.getUsers();
  }

  removeUser(id: number): void {
    const confirmed = confirm('Deseja realmente excluir este usuário?');

    if (!confirmed) {
      return;
    }

    this.authService.removeUser(id);
  }

  get totalUsers(): number {
    return this.users.length;
  }

  get clientsCount(): number {
    return this.users.filter((user) => user.role === 'user').length;
  }

  get lawyersCount(): number {
    return this.users.filter((user) => user.role === 'lawyer').length;
  }

  get adminsCount(): number {
    return this.users.filter((user) => user.role === 'admin').length;
  }

  getRoleLabel(role: User['role']): string {
    switch (role) {
      case 'admin':
        return 'Administrador';

      case 'lawyer':
        return 'Advogado';

      case 'user':
        return 'Cliente';

      default:
        return role;
    }
  }
}

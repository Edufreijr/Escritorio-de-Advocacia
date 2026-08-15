import { Injectable, signal } from '@angular/core';

import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'araujo-freitas-user';
  private readonly usersStorageKey = 'araujo-freitas-users';

  private readonly currentUser = signal<User | null>(
    this.loadUser(),
  );

  readonly user = this.currentUser.asReadonly();

  login(user: User): void {
    this.currentUser.set(user);

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(user),
    );
  }

  logout(): void {
    this.currentUser.set(null);

    localStorage.removeItem(this.storageKey);
  }

  register(
    name: string,
    email: string,
    password: string,
  ): User | null {
    const users = this.getUsers();

    const emailAlreadyExists = users.some(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );

    if (emailAlreadyExists) {
      return null;
    }

    const user: User = {
      id: Date.now(),
      name,
      email,
      password,
      role: 'user',
    };

    users.push(user);

    localStorage.setItem(
      this.usersStorageKey,
      JSON.stringify(users),
    );

    this.login(user);

    return user;
  }

  isEmailRegistered(email: string): boolean {
    return this.getUsers().some(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  hasRole(role: User['role']): boolean {
    return this.currentUser()?.role === role;
  }

  getUsers(): User[] {
    const storedUsers = localStorage.getItem(
      this.usersStorageKey,
    );

    if (!storedUsers) {
      const defaultUsers: User[] = [
        {
          id: 1,
          name: 'Administrador',
          email: 'admin@araujoefreitas.com',
          password: '123456',
          role: 'admin',
        },
        {
          id: 2,
          name: 'Dr. João da Silva',
          email: 'advogado@araujoefreitas.com',
          password: '123456',
          role: 'lawyer',
        },
        {
          id: 3,
          name: 'Cliente',
          email: 'cliente@araujoefreitas.com',
          password: '123456',
          role: 'user',
        },
      ];

      localStorage.setItem(
        this.usersStorageKey,
        JSON.stringify(defaultUsers),
      );

      return defaultUsers;
    }

    try {
      const users = JSON.parse(storedUsers) as User[];

      if (!Array.isArray(users)) {
        return [];
      }

      return users;
    } catch {
      return [];
    }
  }

  authenticate(
    email: string,
    password: string,
  ): User | null {
    const user = this.getUsers().find(
      (item) =>
        item.email.toLowerCase() === email.toLowerCase() &&
        item.password === password,
    );

    if (!user) {
      return null;
    }

    this.login(user);

    return user;
  }

  private loadUser(): User | null {
    const storedUser = localStorage.getItem(this.storageKey);

    if (!storedUser) {
      return null;
    }

    try {
      const user = JSON.parse(storedUser) as User;

      if (
        !user ||
        typeof user.id !== 'number' ||
        typeof user.name !== 'string' ||
        typeof user.email !== 'string' ||
        typeof user.password !== 'string' ||
        !['user', 'lawyer', 'admin'].includes(user.role)
      ) {
        localStorage.removeItem(this.storageKey);
        return null;
      }

      return user;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}




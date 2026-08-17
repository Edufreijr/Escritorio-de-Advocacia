import { Injectable, inject, signal } from '@angular/core';

import { AppointmentService } from './appointment.service';
import { ContactService } from './contact.service';

import { User } from '../interfaces/user';
import { generateSeedData } from '../data/seed.data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly appointmentService = inject(AppointmentService);

  private readonly contactService = inject(ContactService);

  private readonly storageKey = 'araujo-freitas-user';

  private readonly usersStorageKey = 'araujo-freitas-users';

  private readonly lawyerEmailDomain = '@araujoefreitas.com';

  private readonly lawyerDefaultPassword = '123456';

  private readonly currentUser = signal<User | null>(this.loadUser());

  readonly user = this.currentUser.asReadonly();

  login(user: User): void {
    this.currentUser.set(user);

    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  logout(): void {
    this.currentUser.set(null);

    localStorage.removeItem(this.storageKey);
  }

  register(name: string, email: string, phone: string, password: string): User | null {
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
      phone,
      password,
      role: 'user',
    };

    users.push(user);

    this.saveUsers(users);

    this.login(user);

    return user;
  }

  createLawyerAccount(lawyerId: number, name: string): User | null {
    const users = this.getUsers();

    const existingById = users.find((user) => user.id === lawyerId && user.role === 'lawyer');

    if (existingById) {
      const updatedUser: User = {
        ...existingById,
        name,
      };

      const updatedUsers = users.map((user) =>
        user.id === lawyerId && user.role === 'lawyer' ? updatedUser : user,
      );

      this.saveUsers(updatedUsers);

      return updatedUser;
    }

    const email = `advogado${lawyerId}${this.lawyerEmailDomain}`;

    const emailAlreadyExists = users.some(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );

    if (emailAlreadyExists) {
      return null;
    }

    const lawyerUser: User = {
      id: lawyerId,
      name,
      email,
      phone: '',
      password: this.lawyerDefaultPassword,
      role: 'lawyer',
    };

    this.saveUsers([...users, lawyerUser]);

    return lawyerUser;
  }

  updateLawyerAccount(lawyerId: number, name: string): User | null {
    const users = this.getUsers();

    const lawyerUser = users.find((user) => user.id === lawyerId && user.role === 'lawyer');

    if (!lawyerUser) {
      return this.createLawyerAccount(lawyerId, name);
    }

    const updatedUser: User = {
      ...lawyerUser,
      name,
    };

    this.saveUsers(
      users.map((user) => (user.id === lawyerId && user.role === 'lawyer' ? updatedUser : user)),
    );

    if (this.currentUser()?.id === lawyerId && this.currentUser()?.role === 'lawyer') {
      this.login(updatedUser);
    }

    return updatedUser;
  }

  removeLawyerAccount(lawyerId: number): boolean {
    const users = this.getUsers();

    const lawyer = users.find((user) => user.id === lawyerId && user.role === 'lawyer');

    if (!lawyer) {
      return false;
    }

    this.saveUsers(users.filter((user) => !(user.id === lawyerId && user.role === 'lawyer')));

    if (this.currentUser()?.id === lawyerId && this.currentUser()?.role === 'lawyer') {
      this.logout();
    }

    return true;
  }

  isEmailRegistered(email: string): boolean {
    return this.getUsers().some((user) => user.email.toLowerCase() === email.toLowerCase());
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
    const seedData = generateSeedData();

    const storedUsers = localStorage.getItem(this.usersStorageKey);

    const seedUsers: User[] = seedData.users;

    const seedLawyerUsers: User[] = seedData.lawyers.map((lawyer) => ({
      id: lawyer.id,
      name: lawyer.name,
      email: `advogado${lawyer.id}${this.lawyerEmailDomain}`,
      phone: '',
      password: this.lawyerDefaultPassword,
      role: 'lawyer',
    }));

    const adminUser: User = {
      id: 1,
      name: 'Administrador',
      email: 'admin@araujoefreitas.com',
      phone: '',
      password: '123456',
      role: 'admin',
    };

    if (!storedUsers) {
      const users = [adminUser, ...seedUsers, ...seedLawyerUsers];

      this.saveUsers(users);

      return users;
    }

    try {
      const parsedUsers = JSON.parse(storedUsers);

      if (!Array.isArray(parsedUsers)) {
        throw new Error('Invalid users storage');
      }

      const users = parsedUsers
        .filter(
          (user): user is User =>
            !!user &&
            typeof user.id === 'number' &&
            typeof user.name === 'string' &&
            typeof user.email === 'string' &&
            typeof user.phone === 'string' &&
            typeof user.password === 'string' &&
            ['user', 'lawyer', 'admin'].includes(user.role),
        )
        .filter((user) => user.id !== 2 && user.email !== 'advogado@araujoefreitas.com');

      const hasAdmin = users.some((user) => user.id === 1 && user.role === 'admin');

      if (!hasAdmin) {
        users.unshift(adminUser);
      }

      this.saveUsers(users);

      return users;
    } catch {
      localStorage.removeItem(this.usersStorageKey);

      const users = [adminUser, ...seedUsers, ...seedLawyerUsers];

      this.saveUsers(users);

      return users;
    }
  }

  removeUser(id: number): boolean {
    const users = this.getUsers();

    const user = users.find((item) => item.id === id);

    if (!user) {
      return false;
    }

    if (user.id === 1 || user.email === 'admin@araujoefreitas.com') {
      return false;
    }

    const updatedUsers = users.filter((item) => item.id !== id);

    this.saveUsers(updatedUsers);

    this.appointmentService.removeByUserId(user.id);

    this.contactService.removeByEmail(user.email);

    if (this.currentUser()?.id === id) {
      this.logout();
    }

    return true;
  }

  getLawyers(): User[] {
    return this.getUsers().filter((user) => user.role === 'lawyer');
  }

  authenticate(email: string, password: string): User | null {
    const user = this.getUsers().find(
      (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password,
    );

    if (!user) {
      return null;
    }

    this.login(user);

    return user;
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.usersStorageKey, JSON.stringify(users));
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
        typeof user.phone !== 'string' ||
        typeof user.password !== 'string' ||
        !['user', 'lawyer', 'admin'].includes(user.role)
      ) {
        localStorage.removeItem(this.storageKey);

        return null;
      }

      if (user.id === 2 || user.email === 'advogado@araujoefreitas.com') {
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

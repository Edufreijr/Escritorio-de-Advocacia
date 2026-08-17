import { Injectable, signal } from '@angular/core';

import { Lawyer } from '../interfaces/lawyer';
import { generateSeedData } from '../data/seed.data';

@Injectable({
  providedIn: 'root',
})
export class LawyerService {
  private readonly storageKey =
    'araujo-freitas-lawyers';

  private readonly lawyers = signal<Lawyer[]>(
    this.loadLawyers(),
  );

  readonly all = this.lawyers.asReadonly();

  getAll(): Lawyer[] {
    return this.lawyers();
  }

  getById(id: number): Lawyer | undefined {
    return this.lawyers().find(
      (lawyer) => lawyer.id === id,
    );
  }

  addLawyer(
    data: Omit<Lawyer, 'id'>,
  ): Lawyer {
    const lawyer: Lawyer = {
      id: Date.now(),
      ...data,
    };

    this.lawyers.update((lawyers) => [
      ...lawyers,
      lawyer,
    ]);

    this.saveLawyers();

    return lawyer;
  }

  updateLawyer(
    id: number,
    data: Omit<Lawyer, 'id'>,
  ): Lawyer | undefined {
    const lawyer = this.getById(id);

    if (!lawyer) {
      return undefined;
    }

    const updatedLawyer: Lawyer = {
      id,
      ...data,
    };

    this.lawyers.update((lawyers) =>
      lawyers.map((item) =>
        item.id === id
          ? updatedLawyer
          : item,
      ),
    );

    this.saveLawyers();

    return updatedLawyer;
  }

  removeLawyer(id: number): boolean {
    const exists = this.lawyers().some(
      (lawyer) => lawyer.id === id,
    );

    if (!exists) {
      return false;
    }

    this.lawyers.update((lawyers) =>
      lawyers.filter(
        (lawyer) => lawyer.id !== id,
      ),
    );

    this.saveLawyers();

    return true;
  }

  private loadLawyers(): Lawyer[] {
    const seedLawyers =
      generateSeedData().lawyers;

    const storedLawyers =
      localStorage.getItem(this.storageKey);

    if (!storedLawyers) {
      this.saveInitialLawyers(seedLawyers);

      return seedLawyers;
    }

    try {
      const parsedLawyers =
        JSON.parse(storedLawyers);

      if (!Array.isArray(parsedLawyers)) {
        this.saveInitialLawyers(seedLawyers);

        return seedLawyers;
      }

      const stored = parsedLawyers.filter(
        (lawyer): lawyer is Lawyer =>
          !!lawyer &&
          typeof lawyer.id === 'number' &&
          typeof lawyer.name === 'string' &&
          typeof lawyer.role === 'string' &&
          typeof lawyer.oab === 'string' &&
          Array.isArray(lawyer.specialties) &&
          lawyer.specialties.every(
            (specialty: unknown) =>
              typeof specialty === 'string',
          ) &&
          typeof lawyer.bio === 'string' &&
          typeof lawyer.image === 'string',
      );

      const storedIds = new Set(
        stored.map((lawyer) => lawyer.id),
      );

      const missingSeedLawyers =
        seedLawyers.filter(
          (lawyer) => !storedIds.has(lawyer.id),
        );

      const lawyers = [
        ...stored,
        ...missingSeedLawyers,
      ];

      this.saveLawyersList(lawyers);

      return lawyers;
    } catch {
      this.saveInitialLawyers(seedLawyers);

      return seedLawyers;
    }
  }

  private saveLawyers(): void {
    this.saveLawyersList(this.lawyers());
  }

  private saveLawyersList(
    lawyers: Lawyer[],
  ): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(lawyers),
    );
  }

  private saveInitialLawyers(
    lawyers: Lawyer[],
  ): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(lawyers),
    );
  }
}
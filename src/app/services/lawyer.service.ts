import { Injectable } from '@angular/core';

import { LAWYERS } from '../data/lawyers.data';
import { Lawyer } from '../interfaces/lawyer';

@Injectable({
  providedIn: 'root',
})
export class LawyerService {
  private readonly lawyers = LAWYERS;

  getAll(): Lawyer[] {
    return this.lawyers;
  }

  getById(id: number): Lawyer | undefined {
    return this.lawyers.find((lawyer) => lawyer.id === id);
  }
}

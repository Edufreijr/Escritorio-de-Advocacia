import { Injectable } from '@angular/core';

import { PRACTICE_AREAS } from '../data/practice-areas.data';
import { PracticeArea } from '../interfaces/practice-area';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  private readonly areas = PRACTICE_AREAS;

  getAll(): PracticeArea[] {
    return this.areas;
  }

  getById(id: number): PracticeArea | undefined {
    return this.areas.find((area) => area.id === id);
  }

  getBySlug(slug: string): PracticeArea | undefined {
    return this.areas.find((area) => area.slug === slug);
  }
}
